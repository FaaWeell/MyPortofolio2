const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pause',
    aliases: [],
    description: 'Pause the current song',
    
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

        if (queue.paused) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`${emojis.error} The song is already paused!`)
                ]
            });
        }

        queue.pause();
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setDescription(`${emojis.pause} Paused the song!`)
            ]
        });
    }
};
