require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();
client.cooldowns = new Collection();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('[MultiBot] Connected to MongoDB'))
    .catch(err => console.error('[MultiBot] MongoDB Error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    odId: String,
    odId: String,
    odId: String,
    balance: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    lastDaily: Date,
    lastWork: Date,
    warnings: [{ reason: String, date: Date, moderator: String }]
});

const User = mongoose.model('User', userSchema);
client.User = User;

// Load Commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.name) {
        client.commands.set(command.name, command);
    }
}

client.on('ready', () => {
    console.log(`[MultiBot] ${client.user.tag} is online!`);
    console.log(`[MultiBot] Serving ${client.guilds.cache.size} servers`);
    
    client.user.setActivity('!help | MultiBot Pro', { type: 0 });
});

// XP & Leveling System
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    // XP System
    const cooldownKey = `xp_${message.author.id}`;
    if (!client.cooldowns.has(cooldownKey)) {
        let userData = await User.findOne({ odId: message.author.id, odId: message.guild.id });
        if (!userData) {
            userData = new User({ odId: message.author.id, odId: message.guild.id });
        }

        userData.xp += config.leveling.xpPerMessage;
        const xpNeeded = userData.level * 100;

        if (userData.xp >= xpNeeded) {
            userData.level += 1;
            userData.xp = 0;
            
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Level Up!')
                .setDescription(`${message.author} naik ke level **${userData.level}**!`)
                .setTimestamp();
            
            message.channel.send({ embeds: [embed] });
        }

        await userData.save();
        client.cooldowns.set(cooldownKey, Date.now());
        setTimeout(() => client.cooldowns.delete(cooldownKey), config.leveling.xpCooldown);
    }

    // Command Handler
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (command) {
        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            message.reply('Terjadi error saat menjalankan command!');
        }
    }
});

client.login(process.env.BOT_TOKEN);
