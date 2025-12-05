const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'profile',
    aliases: ['p', 'stats', 'me'],
    description: 'Lihat profil game kamu',
    
    async execute(message, args, client) {
        const target = message.mentions.users.first() || message.author;
        
        let player = await client.Player.findOne({ odId: target.id });
        if (!player) {
            if (target.id === message.author.id) {
                player = new client.Player({ odId: target.id });
                await player.save();
            } else {
                return message.reply('Player tidak ditemukan!');
            }
        }

        const expNeeded = player.level * 50;
        const expProgress = Math.floor((player.exp / expNeeded) * 10);
        const expBar = '█'.repeat(expProgress) + '░'.repeat(10 - expProgress);
        
        const winRate = player.wins + player.losses > 0 
            ? ((player.wins / (player.wins + player.losses)) * 100).toFixed(1) 
            : 0;

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`🎮 ${target.username}'s Profile`)
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: '📊 Level', value: `**${player.level}**\n\`${expBar}\`\n${player.exp}/${expNeeded} EXP`, inline: false },
                { name: '💰 Gold', value: `${player.gold}`, inline: true },
                { name: '❤️ HP', value: `${player.hp}/${player.maxHp}`, inline: true },
                { name: '🎯 Trivia Score', value: `${player.triviaScore}`, inline: true },
                { name: '⚔️ Attack', value: `${player.attack}`, inline: true },
                { name: '🛡️ Defense', value: `${player.defense}`, inline: true },
                { name: '📈 Win Rate', value: `${winRate}%\n(${player.wins}W / ${player.losses}L)`, inline: true }
            )
            .setFooter({ text: 'GameHub Bot' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
