const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'resume',
    aliases: ['r', 'unpause'],
    description: 'Resume the paused song',
    
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

        if (!queue.paused) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`${emojis.error} The song is not paused!`)
                ]
            });
        }

        queue.resume();
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setDescription(`${emojis.play} Resumed the song!`)
            ]
        });
    }
};
