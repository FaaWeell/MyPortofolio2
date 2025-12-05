const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'balance',
    aliases: ['bal', 'money'],
    description: 'Cek saldo kamu',
    
    async execute(message, args, client) {
        const target = message.mentions.users.first() || message.author;
        
        let userData = await client.User.findOne({ odId: target.id, odId: message.guild.id });
        if (!userData) {
            userData = new client.User({ odId: target.id, odId: message.guild.id });
            await userData.save();
        }

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`Saldo ${target.username}`)
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: 'Balance', value: `${userData.balance} ${config.economy.currency}`, inline: true },
                { name: 'Level', value: `${userData.level}`, inline: true },
                { name: 'XP', value: `${userData.xp}/${userData.level * 100}`, inline: true }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
