const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'help',
    description: 'Tampilkan daftar command',
    
    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('🎮 GameHub Bot - Commands')
            .setDescription('Bot game dengan berbagai mini-games seru!')
            .addFields(
                {
                    name: '🎯 Trivia',
                    value: [
                        `\`${config.prefix}trivia\` - Main trivia quiz`,
                    ].join('\n')
                },
                {
                    name: '⚔️ RPG',
                    value: [
                        `\`${config.prefix}adventure\` - Pergi berpetualang`,
                        `\`${config.prefix}profile\` - Lihat profil game`,
                    ].join('\n')
                },
                {
                    name: '🏆 Leaderboard',
                    value: [
                        `\`${config.prefix}leaderboard\` - Top levels`,
                        `\`${config.prefix}leaderboard gold\` - Richest`,
                        `\`${config.prefix}leaderboard trivia\` - Trivia masters`,
                        `\`${config.prefix}leaderboard wins\` - Most wins`
                    ].join('\n')
                }
            )
            .setFooter({ text: 'GameHub Bot v1.0' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
