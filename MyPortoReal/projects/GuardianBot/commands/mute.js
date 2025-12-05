const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'mute',
    description: 'Mute member untuk durasi tertentu',
    
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('Kamu tidak punya permission untuk mute!');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Mention member yang ingin di-mute!');
        }

        if (!target.moderatable) {
            return message.reply('Tidak bisa mute member ini!');
        }

        const duration = args[1] || '10m';
        const reason = args.slice(2).join(' ') || 'Tidak ada alasan';
        
        const durationMs = ms(duration);
        if (!durationMs || durationMs > 2419200000) {
            return message.reply('Durasi tidak valid! Maksimal 28 hari.');
        }

        try {
            await target.timeout(durationMs, reason);

            const embed = new EmbedBuilder()
                .setColor('#ffff00')
                .setTitle('🔇 Member Muted')
                .setDescription(`${target} telah di-mute!`)
                .addFields(
                    { name: 'Oleh', value: `${message.author}`, inline: true },
                    { name: 'Durasi', value: duration, inline: true },
                    { name: 'Alasan', value: reason }
                )
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            message.reply('Gagal mute member!');
        }
    }
};
