require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration
    ]
});

client.commands = new Collection();
client.spamCache = new Map();
client.joinCache = new Map();
client.warnCache = new Map();

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
    console.log(`[Guardian] ${client.user.tag} is online!`);
    console.log(`[Guardian] Protecting ${client.guilds.cache.size} servers`);
    
    client.user.setActivity('🛡️ Protecting servers', { type: 3 });
});

// Anti-Spam System
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    if (message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) return;

    const userId = message.author.id;
    const now = Date.now();

    // Spam Detection
    if (!client.spamCache.has(userId)) {
        client.spamCache.set(userId, []);
    }

    const userMessages = client.spamCache.get(userId);
    userMessages.push(now);

    const recentMessages = userMessages.filter(
        timestamp => now - timestamp < config.antiSpam.timeWindow
    );
    client.spamCache.set(userId, recentMessages);

    if (recentMessages.length >= config.antiSpam.maxMessages) {
        await handleSpam(message);
        return;
    }

    // Auto-Mod: Banned Words
    const content = message.content.toLowerCase();
    for (const word of config.autoMod.bannedWords) {
        if (content.includes(word.toLowerCase())) {
            await message.delete().catch(() => {});
            await message.channel.send({
                embeds: [createEmbed('warning', `${message.author}, pesan kamu mengandung kata terlarang!`)]
            });
            return;
        }
    }

    // Auto-Mod: Max Mentions
    if (message.mentions.users.size > config.autoMod.maxMentions) {
        await message.delete().catch(() => {});
        await message.channel.send({
            embeds: [createEmbed('warning', `${message.author}, terlalu banyak mention!`)]
        });
        return;
    }

    // Command Handler
    if (message.content.startsWith(config.prefix)) {
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
    }
});

// Anti-Raid System
client.on('guildMemberAdd', async (member) => {
    const guildId = member.guild.id;
    const now = Date.now();

    if (!client.joinCache.has(guildId)) {
        client.joinCache.set(guildId, []);
    }

    const joins = client.joinCache.get(guildId);
    joins.push({ id: member.id, time: now });

    const recentJoins = joins.filter(
        join => now - join.time < config.antiRaid.timeWindow
    );
    client.joinCache.set(guildId, recentJoins);

    if (recentJoins.length >= config.antiRaid.maxJoins) {
        await handleRaid(member.guild, recentJoins);
    }
});

async function handleSpam(message) {
    const userId = message.author.id;
    const warns = (client.warnCache.get(userId) || 0) + 1;
    client.warnCache.set(userId, warns);

    try {
        const messages = await message.channel.messages.fetch({ limit: 10 });
        const userSpamMessages = messages.filter(m => m.author.id === userId);
        await message.channel.bulkDelete(userSpamMessages);
    } catch (error) {}

    if (warns >= config.antiSpam.warnThreshold) {
        try {
            await message.member.timeout(600000, 'Spam berulang');
            await message.channel.send({
                embeds: [createEmbed('error', `${message.author} telah di-mute karena spam berulang!`)]
            });
        } catch (error) {}
        client.warnCache.delete(userId);
    } else {
        await message.channel.send({
            embeds: [createEmbed('warning', `${message.author}, stop spam! Peringatan ${warns}/${config.antiSpam.warnThreshold}`)]
        });
    }

    client.spamCache.delete(userId);
}

async function handleRaid(guild, raiders) {
    console.log(`[Guardian] Raid terdeteksi di ${guild.name}!`);

    const logChannel = guild.channels.cache.find(
        ch => ch.name === 'mod-logs' || ch.name === 'guardian-logs'
    );

    if (logChannel) {
        await logChannel.send({
            embeds: [createEmbed('error', `🚨 **RAID TERDETEKSI!**\n\n${raiders.length} member join dalam waktu singkat!`)]
        });
    }

    // Kick raiders
    for (const raider of raiders) {
        try {
            const member = await guild.members.fetch(raider.id);
            if (member && member.kickable) {
                await member.kick('Anti-Raid: Terdeteksi sebagai bagian dari raid');
            }
        } catch (error) {}
    }

    client.joinCache.delete(guild.id);
}

function createEmbed(type, description) {
    const colors = {
        success: '#00ff00',
        warning: '#ffff00',
        error: '#ff0000',
        info: config.embedColor
    };

    const icons = {
        success: '✅',
        warning: '⚠️',
        error: '❌',
        info: '🛡️'
    };

    return new EmbedBuilder()
        .setColor(colors[type] || config.embedColor)
        .setDescription(`${icons[type] || ''} ${description}`)
        .setFooter({ text: 'Guardian Bot | Security' })
        .setTimestamp();
}

client.login(process.env.BOT_TOKEN);

module.exports = { createEmbed };
