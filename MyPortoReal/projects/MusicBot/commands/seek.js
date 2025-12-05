const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'seek',
    aliases: ['jumpto'],
    description: 'Seek to a specific position in the song',
    usage: '<seconds>',
    
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

        const time = parseInt(args[0]);
        if (!args[0] || isNaN(time)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`${emojis.error} Please provide a time in seconds!`)
                ]
            });
        }

        if (time < 0 || time > queue.songs[0].duration) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`${emojis.error} Invalid time! Song duration: ${queue.songs[0].formattedDuration}`)
                ]
            });
        }

        await queue.seek(time);
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setDescription(`⏩ Seeked to **${new Date(time * 1000).toISOString().substr(14, 5)}**`)
            ]
        });
    }
};
