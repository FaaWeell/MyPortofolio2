const { EmbedBuilder } = require('discord.js');
const config = require('../config');

const jobs = [
    { name: 'Programmer', emoji: '💻' },
    { name: 'Barista', emoji: '☕' },
    { name: 'Driver', emoji: '🚗' },
    { name: 'Chef', emoji: '👨‍🍳' },
    { name: 'Streamer', emoji: '🎮' },
    { name: 'Designer', emoji: '🎨' }
];

module.exports = {
    name: 'work',
    description: 'Kerja untuk mendapat uang',
    
    async execute(message, args, client) {
        let userData = await client.User.findOne({ odId: message.author.id, odId: message.guild.id });
        if (!userData) {
            userData = new client.User({ odId: message.author.id, odId: message.guild.id });
        }

        const now = new Date();
        const lastWork = userData.lastWork ? new Date(userData.lastWork) : null;
        
        if (lastWork && now - lastWork < config.economy.workCooldown) {
            const timeLeft = config.economy.workCooldown - (now - lastWork);
            const minutes = Math.floor(timeLeft / 60000);
            
            return message.reply(`Kamu sudah kerja! Tunggu **${minutes} menit** lagi.`);
        }

        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const earned = Math.floor(Math.random() * (config.economy.workReward.max - config.economy.workReward.min + 1)) + config.economy.workReward.min;

        userData.balance += earned;
        userData.lastWork = now;
        await userData.save();

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${job.emoji} Kerja sebagai ${job.name}`)
            .setDescription(`Kamu mendapat **${earned} ${config.economy.currency}**!`)
            .addFields({ name: 'Saldo Baru', value: `${userData.balance} ${config.economy.currency}` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
