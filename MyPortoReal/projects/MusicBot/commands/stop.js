const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'stop',
    aliases: ['leave', 'disconnect', 'dc'],
    description: 'Stop the music and leave the voice channel',
    
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

        await queue.stop();
        
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setDescription(`${emojis.stop} Stopped the music and left the channel!`)
            ]
        });
    }
};
