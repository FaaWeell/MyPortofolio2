const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'level',
    aliases: ['rank', 'xp'],
    description: 'Cek level dan XP kamu',
    
    async execute(message, args, client) {
        const target = message.mentions.users.first() || message.author;
        
        let userData = await client.User.findOne({ odId: target.id, odId: message.guild.id });
        if (!userData) {
            userData = new client.User({ odId: target.id, odId: message.guild.id });
            await userData.save();
        }

        const xpNeeded = userData.level * 100;
        const progress = Math.floor((userData.xp / xpNeeded) * 20);
        const progressBar = '█'.repeat(progress) + '░'.repeat(20 - progress);

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`Level ${target.username}`)
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: 'Level', value: `${userData.level}`, inline: true },
                { name: 'XP', value: `${userData.xp}/${xpNeeded}`, inline: true },
                { name: 'Progress', value: `\`${progressBar}\`` }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
