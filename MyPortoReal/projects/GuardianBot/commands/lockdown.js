const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'lockdown',
    description: 'Lock/unlock channel',
    
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply('Kamu tidak punya permission untuk ini!');
        }

        const channel = message.mentions.channels.first() || message.channel;
        const action = args[0]?.toLowerCase();

        if (action === 'off' || action === 'unlock') {
            try {
                await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    SendMessages: null
                });

                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('🔓 Channel Unlocked')
                    .setDescription(`${channel} telah di-unlock!`)
                    .setTimestamp();

                message.channel.send({ embeds: [embed] });
            } catch (error) {
                message.reply('Gagal unlock channel!');
            }
        } else {
            try {
                await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    SendMessages: false
                });

                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('🔒 Channel Locked')
                    .setDescription(`${channel} telah di-lock!`)
                    .addFields({ name: 'Alasan', value: args.join(' ') || 'Lockdown aktif' })
                    .setTimestamp();

                message.channel.send({ embeds: [embed] });
            } catch (error) {
                message.reply('Gagal lock channel!');
            }
        }
    }
};
