const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'leaderboard',
    aliases: ['lb', 'top'],
    description: 'Lihat leaderboard',
    
    async execute(message, args, client) {
        const type = args[0]?.toLowerCase() || 'level';
        
        let players, title, emoji;
        
        switch (type) {
            case 'gold':
            case 'rich':
                players = await client.Player.find().sort({ gold: -1 }).limit(10);
                title = 'Richest Players';
                emoji = '💰';
                break;
            case 'trivia':
            case 'quiz':
                players = await client.Player.find().sort({ triviaScore: -1 }).limit(10);
                title = 'Trivia Masters';
                emoji = '🎯';
                break;
            case 'wins':
            case 'pvp':
                players = await client.Player.find().sort({ wins: -1 }).limit(10);
                title = 'Most Wins';
                emoji = '🏆';
                break;
            default:
                players = await client.Player.find().sort({ level: -1, exp: -1 }).limit(10);
                title = 'Highest Levels';
                emoji = '⭐';
        }

        if (!players.length) {
            return message.reply('Belum ada data!');
        }

        const medals = ['🥇', '🥈', '🥉'];
        let description = '';

        for (let i = 0; i < players.length; i++) {
            const user = await client.users.fetch(players[i].odId).catch(() => null);
            const medal = medals[i] || `\`${i + 1}.\``;
            const name = user?.username || 'Unknown';
            
            let value;
            switch (type) {
                case 'gold':
                case 'rich':
                    value = `${players[i].gold} gold`;
                    break;
                case 'trivia':
                case 'quiz':
                    value = `${players[i].triviaScore} points`;
                    break;
                case 'wins':
                case 'pvp':
                    value = `${players[i].wins} wins`;
                    break;
                default:
                    value = `Lv.${players[i].level} (${players[i].exp} XP)`;
            }
            
            description += `${medal} **${name}** - ${value}\n`;
        }

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${emoji} Leaderboard - ${title}`)
            .setDescription(description)
            .setFooter({ text: '!leaderboard [level/gold/trivia/wins]' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
