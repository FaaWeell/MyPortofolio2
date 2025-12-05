const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'loop',
    aliases: ['repeat', 'lp'],
    description: 'Toggle loop mode (off/song/queue)',
    usage: '[off|song|queue]',
    
    async execute(message, args, client) {
        const { emojis, embedColor } = client.config;
        
        const queue = client.distube.getQueue(message);
        if (!queue) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`${emojis.error} Nothing is playing!`)
                ]
            });
        }

        let mode;
        const input = args[0]?.toLowerCase();

        if (!input) {
            mode = queue.repeatMode === 0 ? 1 : queue.repeatMode === 1 ? 2 : 0;
        } else if (input === 'off' || input === '0') {
            mode = 0;
        } else if (input === 'song' || input === '1') {
            mode = 1;
        } else if (input === 'queue' || input === '2') {
            mode = 2;
        } else {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`${emojis.error} Invalid mode! Use: off, song, or queue`)
                ]
            });
        }

        mode = queue.setRepeatMode(mode);
        const modeText = mode === 0 ? 'Off' : mode === 1 ? 'Song' : 'Queue';
        
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setDescription(`${emojis.loop} Loop mode: **${modeText}**`)
            ]
        });
    }
};
