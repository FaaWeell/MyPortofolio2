const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'leaderboard',
    aliases: ['lb', 'top'],
    description: 'Lihat leaderboard server',
    
    async execute(message, args, client) {
        const type = args[0]?.toLowerCase() || 'level';
        
        let users;
        let title;
        
        if (type === 'balance' || type === 'money' || type === 'rich') {
            users = await client.User.find({ odId: message.guild.id })
                .sort({ balance: -1 })
                .limit(10);
            title = 'Leaderboard - Richest';
        } else {
            users = await client.User.find({ odId: message.guild.id })
                .sort({ level: -1, xp: -1 })
                .limit(10);
            title = 'Leaderboard - Level';
        }

        if (!users.length) {
            return message.reply('Belum ada data leaderboard!');
        }

        const medals = ['🥇', '🥈', '🥉'];
        let description = '';

        for (let i = 0; i < users.length; i++) {
            const user = await client.users.fetch(users[i].odId).catch(() => null);
            const medal = medals[i] || `\`${i + 1}.\``;
            
            if (type === 'balance' || type === 'money' || type === 'rich') {
                description += `${medal} ${user?.username || 'Unknown'} - **${users[i].balance}** ${config.economy.currency}\n`;
            } else {
                description += `${medal} ${user?.username || 'Unknown'} - Level **${users[i].level}** (${users[i].xp} XP)\n`;
            }
        }

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(title)
            .setDescription(description)
            .setFooter({ text: `Server: ${message.guild.name}` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
