const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'warn',
    description: 'Beri warning ke member',
    
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('Kamu tidak punya permission untuk ini!');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Mention member yang ingin di-warn!');
        }

        const reason = args.slice(1).join(' ') || 'Tidak ada alasan';

        const warns = (client.warnCache.get(target.id) || 0) + 1;
        client.warnCache.set(target.id, warns);

        const embed = new EmbedBuilder()
            .setColor('#ffff00')
            .setTitle('⚠️ Warning')
            .setDescription(`${target} telah menerima warning!`)
            .addFields(
                { name: 'Oleh', value: `${message.author}`, inline: true },
                { name: 'Total Warns', value: `${warns}`, inline: true },
                { name: 'Alasan', value: reason }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

        if (warns >= 3) {
            try {
                await target.timeout(600000, `Reached ${warns} warnings`);
                message.channel.send(`${target} telah di-mute karena terlalu banyak warning!`);
            } catch (error) {}
        }
    }
};
