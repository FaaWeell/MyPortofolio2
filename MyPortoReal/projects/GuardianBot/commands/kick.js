const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick member dari server',
    
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply('Kamu tidak punya permission untuk kick!');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Mention member yang ingin di-kick!');
        }

        if (!target.kickable) {
            return message.reply('Tidak bisa kick member ini!');
        }

        const reason = args.slice(1).join(' ') || 'Tidak ada alasan';

        try {
            await target.kick(reason);

            const embed = new EmbedBuilder()
                .setColor('#ff6600')
                .setTitle('👢 Member Kicked')
                .setDescription(`${target.user.tag} telah di-kick dari server!`)
                .addFields(
                    { name: 'Oleh', value: `${message.author}`, inline: true },
                    { name: 'Alasan', value: reason }
                )
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            message.reply('Gagal kick member!');
        }
    }
};
