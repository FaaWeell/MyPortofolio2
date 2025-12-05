const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'help',
    description: 'Tampilkan daftar command',
    
    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('🛡️ Guardian Bot - Commands')
            .setDescription('Bot keamanan untuk melindungi server kamu!')
            .addFields(
                { 
                    name: '⚔️ Moderation',
                    value: [
                        `\`${config.prefix}warn @user [alasan]\` - Beri warning`,
                        `\`${config.prefix}kick @user [alasan]\` - Kick member`,
                        `\`${config.prefix}ban @user [alasan]\` - Ban member`,
                        `\`${config.prefix}mute @user [durasi] [alasan]\` - Mute member`,
                        `\`${config.prefix}purge [jumlah]\` - Hapus pesan`,
                        `\`${config.prefix}lockdown [off]\` - Lock/unlock channel`
                    ].join('\n')
                },
                {
                    name: '🛡️ Auto-Protection',
                    value: [
                        '• **Anti-Spam** - Deteksi spam otomatis',
                        '• **Anti-Raid** - Proteksi dari raid',
                        '• **Auto-Mod** - Filter kata terlarang & mention'
                    ].join('\n')
                },
                {
                    name: '⚙️ Settings',
                    value: `Edit \`config.js\` untuk mengatur proteksi`
                }
            )
            .setFooter({ text: 'Guardian Bot | Protecting your server' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
