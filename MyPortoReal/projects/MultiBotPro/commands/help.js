const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'help',
    description: 'Tampilkan daftar command',
    
    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('MultiBot Pro - Commands')
            .setDescription('Bot lengkap dengan berbagai fitur!')
            .addFields(
                {
                    name: '💰 Economy',
                    value: [
                        `\`${config.prefix}balance\` - Cek saldo`,
                        `\`${config.prefix}daily\` - Klaim reward harian`,
                        `\`${config.prefix}work\` - Kerja untuk uang`,
                        `\`${config.prefix}leaderboard money\` - Top richest`
                    ].join('\n')
                },
                {
                    name: '⭐ Leveling',
                    value: [
                        `\`${config.prefix}level\` - Cek level & XP`,
                        `\`${config.prefix}leaderboard\` - Top levels`
                    ].join('\n')
                },
                {
                    name: '🛡️ Moderation',
                    value: [
                        `\`${config.prefix}kick\` - Kick member`,
                        `\`${config.prefix}ban\` - Ban member`,
                        `\`${config.prefix}mute\` - Mute member`
                    ].join('\n')
                },
                {
                    name: '🎵 Music',
                    value: [
                        `\`${config.prefix}play\` - Play musik`,
                        `\`${config.prefix}skip\` - Skip lagu`,
                        `\`${config.prefix}stop\` - Stop musik`
                    ].join('\n')
                }
            )
            .setFooter({ text: 'MultiBot Pro v2.0' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
