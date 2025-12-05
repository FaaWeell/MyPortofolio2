const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'purge',
    description: 'Hapus banyak pesan sekaligus',
    
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('Kamu tidak punya permission untuk ini!');
        }

        const amount = parseInt(args[0]);
        if (!amount || amount < 1 || amount > 100) {
            return message.reply('Masukkan jumlah pesan (1-100)!');
        }

        try {
            await message.delete();
            const deleted = await message.channel.bulkDelete(amount, true);

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(`🗑️ Berhasil menghapus **${deleted.size}** pesan!`)
                .setFooter({ text: `Oleh ${message.author.tag}` })
                .setTimestamp();

            const reply = await message.channel.send({ embeds: [embed] });
            setTimeout(() => reply.delete().catch(() => {}), 5000);
        } catch (error) {
            message.channel.send('Gagal menghapus pesan! Pesan yang lebih dari 14 hari tidak bisa dihapus.');
        }
    }
};
