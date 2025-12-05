const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'shuffle',
    aliases: ['mix'],
    description: 'Shuffle the queue',
    
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

        if (queue.songs.length < 3) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`${emojis.error} Need at least 3 songs to shuffle!`)
                ]
            });
        }

        await queue.shuffle();
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setDescription(`🔀 Shuffled ${queue.songs.length} songs!`)
            ]
        });
    }
};
