const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h', 'commands'],
    description: 'Show all commands',
    
    async execute(message, args, client) {
        const { prefix, embedColor, emojis } = client.config;

        const commands = [
            { name: 'play <song>', desc: 'Play a song from YouTube/Spotify/SoundCloud' },
            { name: 'pause', desc: 'Pause the current song' },
            { name: 'resume', desc: 'Resume the paused song' },
            { name: 'skip', desc: 'Skip the current song' },
            { name: 'stop', desc: 'Stop music and leave channel' },
            { name: 'queue', desc: 'Show the current queue' },
            { name: 'nowplaying', desc: 'Show the currently playing song' },
            { name: 'volume <0-100>', desc: 'Set the volume' },
            { name: 'loop [off|song|queue]', desc: 'Toggle loop mode' },
            { name: 'shuffle', desc: 'Shuffle the queue' },
            { name: 'seek <seconds>', desc: 'Seek to a position' },
            { name: 'autoplay', desc: 'Toggle autoplay mode' }
        ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setAuthor({ name: '🎵 MusicMaster Bot - Help', iconURL: client.user.displayAvatarURL() })
            .setDescription(`Prefix: \`${prefix}\`\n\n${commands.map(c => `**${prefix}${c.name}**\n${c.desc}`).join('\n\n')}`)
            .setFooter({ text: `Made by Fajri Fajar Shidik | ${client.guilds.cache.size} servers` })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
