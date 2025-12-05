const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban member dari server',
    
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply('Kamu tidak punya permission untuk ban!');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Mention member yang ingin di-ban!');
        }

        if (!target.bannable) {
            return message.reply('Tidak bisa ban member ini!');
        }

        const reason = args.slice(1).join(' ') || 'Tidak ada alasan';

        try {
            await target.ban({ reason: reason });

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🔨 Member Banned')
                .setDescription(`${target.user.tag} telah di-ban dari server!`)
                .addFields(
                    { name: 'Oleh', value: `${message.author}`, inline: true },
                    { name: 'Alasan', value: reason }
                )
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            message.reply('Gagal ban member!');
        }
    }
};
