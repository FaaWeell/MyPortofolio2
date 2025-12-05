const { EmbedBuilder } = require('discord.js');
const config = require('../config');

const adventures = [
    { name: 'Hutan Gelap', enemies: ['Goblin', 'Wolf', 'Bandit'], goldRange: [10, 30], expRange: [5, 15] },
    { name: 'Gua Kristal', enemies: ['Skeleton', 'Bat Swarm', 'Stone Golem'], goldRange: [20, 50], expRange: [10, 25] },
    { name: 'Kastil Tua', enemies: ['Ghost', 'Vampire', 'Dark Knight'], goldRange: [30, 80], expRange: [20, 40] },
    { name: 'Gunung Api', enemies: ['Fire Elemental', 'Lava Slime', 'Dragon'], goldRange: [50, 120], expRange: [30, 60] }
];

module.exports = {
    name: 'adventure',
    aliases: ['adv', 'petualangan'],
    description: 'Pergi berpetualang',
    cooldown: config.cooldowns.adventure,
    
    async execute(message, args, client) {
        let player = await client.Player.findOne({ odId: message.author.id });
        if (!player) {
            player = new client.Player({ odId: message.author.id });
        }

        const adventure = adventures[Math.floor(Math.random() * adventures.length)];
        const enemy = adventure.enemies[Math.floor(Math.random() * adventure.enemies.length)];
        
        const playerRoll = Math.floor(Math.random() * player.attack) + player.level * 2;
        const enemyRoll = Math.floor(Math.random() * 20) + 5;
        
        const won = playerRoll > enemyRoll;

        let embed;
        
        if (won) {
            const gold = Math.floor(Math.random() * (adventure.goldRange[1] - adventure.goldRange[0])) + adventure.goldRange[0];
            const exp = Math.floor(Math.random() * (adventure.expRange[1] - adventure.expRange[0])) + adventure.expRange[0];
            
            player.gold += gold;
            player.exp += exp;
            player.wins += 1;
            
            // Level up check
            const expNeeded = player.level * 50;
            if (player.exp >= expNeeded) {
                player.level += 1;
                player.exp = 0;
                player.attack += 2;
                player.defense += 1;
                player.maxHp += 10;
                player.hp = player.maxHp;
            }
            
            await player.save();

            embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle(`⚔️ ${adventure.name}`)
                .setDescription(`Kamu bertemu **${enemy}** dan berhasil mengalahkannya!`)
                .addFields(
                    { name: 'Rewards', value: `💰 ${gold} gold\n⭐ ${exp} EXP`, inline: true },
                    { name: 'Stats', value: `Level: ${player.level}\nEXP: ${player.exp}/${player.level * 50}`, inline: true }
                )
                .setFooter({ text: `Wins: ${player.wins} | Losses: ${player.losses}` });
        } else {
            const hpLost = Math.floor(Math.random() * 20) + 10;
            player.hp = Math.max(0, player.hp - hpLost);
            player.losses += 1;
            
            if (player.hp <= 0) {
                player.hp = player.maxHp;
                player.gold = Math.floor(player.gold * 0.9);
            }
            
            await player.save();

            embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(`⚔️ ${adventure.name}`)
                .setDescription(`Kamu bertemu **${enemy}** dan kalah dalam pertarungan!`)
                .addFields(
                    { name: 'Damage', value: `💔 -${hpLost} HP`, inline: true },
                    { name: 'HP', value: `${player.hp}/${player.maxHp}`, inline: true }
                )
                .setFooter({ text: player.hp <= 0 ? 'Kamu pingsan dan kehilangan 10% gold!' : '' });
        }

        message.channel.send({ embeds: [embed] });
    }
};
