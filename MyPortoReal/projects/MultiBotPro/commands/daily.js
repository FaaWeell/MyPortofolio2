const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'daily',
    description: 'Klaim reward harian',
    
    async execute(message, args, client) {
        let userData = await client.User.findOne({ odId: message.author.id, odId: message.guild.id });
        if (!userData) {
            userData = new client.User({ odId: message.author.id, odId: message.guild.id });
        }

        const now = new Date();
        const lastDaily = userData.lastDaily ? new Date(userData.lastDaily) : null;
        
        if (lastDaily && now - lastDaily < 86400000) {
            const timeLeft = 86400000 - (now - lastDaily);
            const hours = Math.floor(timeLeft / 3600000);
            const minutes = Math.floor((timeLeft % 3600000) / 60000);
            
            return message.reply(`Kamu sudah klaim daily! Tunggu **${hours}h ${minutes}m** lagi.`);
        }

        userData.balance += config.economy.dailyReward;
        userData.lastDaily = now;
        await userData.save();

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('Daily Reward!')
            .setDescription(`Kamu mendapat **${config.economy.dailyReward} ${config.economy.currency}**!`)
            .addFields({ name: 'Saldo Baru', value: `${userData.balance} ${config.economy.currency}` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
