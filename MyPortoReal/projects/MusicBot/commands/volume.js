const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'volume',
    aliases: ['vol', 'v'],
    description: 'Set the volume (0-100)',
    usage: '<0-100>',
    
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

        const volume = parseInt(args[0]);
        
        if (!args[0]) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(embedColor)
                        .setDescription(`${emojis.volume} Current volume: **${queue.volume}%**`)
                ]
            });
        }

        if (isNaN(volume) || volume < 0 || volume > 100) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`${emojis.error} Please provide a number between 0-100!`)
                ]
            });
        }

        queue.setVolume(volume);
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setDescription(`${emojis.volume} Volume set to **${volume}%**`)
            ]
        });
    }
};
