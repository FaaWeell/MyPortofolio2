const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const config = require('./config');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.config = config;

// DisTube Setup
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin(),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ]
});

// Load Commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        client.commands.set(command.name, command);
        console.log(`✅ Loaded command: ${command.name}`);
    }
}

// Bot Ready
client.once('ready', () => {
    console.log(`\n🎵 ${client.user.tag} is online!`);
    console.log(`📡 Serving ${client.guilds.cache.size} servers`);
    
    client.user.setActivity('!help | 🎵 Music', { type: 2 });
});

// Message Handler
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) 
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply({ 
            embeds: [
                new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(`${config.emojis.error} Error: ${error.message}`)
            ]
        });
    }
});

// DisTube Events
const status = queue => `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Queue' : 'Song') : 'Off'}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

client.distube
    .on('playSong', (queue, song) => {
        queue.textChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setAuthor({ name: 'Now Playing', iconURL: 'https://cdn.discordapp.com/emojis/741605543046807626.gif' })
                    .setTitle(song.name)
                    .setURL(song.url)
                    .setThumbnail(song.thumbnail)
                    .addFields(
                        { name: '⏱️ Duration', value: song.formattedDuration, inline: true },
                        { name: '👤 Requested by', value: `${song.user}`, inline: true }
                    )
                    .setFooter({ text: status(queue) })
            ]
        });
    })
    .on('addSong', (queue, song) => {
        queue.textChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription(`${config.emojis.success} Added **[${song.name}](${song.url})** to the queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.formattedDuration} | Requested by ${song.user.tag}` })
            ]
        });
    })
    .on('addList', (queue, playlist) => {
        queue.textChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription(`${config.emojis.success} Added **${playlist.name}** playlist (${playlist.songs.length} songs) to the queue`)
            ]
        });
    })
    .on('error', (channel, error) => {
        console.error(error);
        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(`${config.emojis.error} An error occurred: ${error.message}`)
            ]
        });
    })
    .on('empty', queue => {
        queue.textChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription('👋 Voice channel is empty! Leaving...')
            ]
        });
    })
    .on('finish', queue => {
        queue.textChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription('🏁 Queue finished! No more songs to play.')
            ]
        });
    });

// Login
client.login(config.token);
