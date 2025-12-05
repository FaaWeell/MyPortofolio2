const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'skip',
    aliases: ['s', 'next'],
    description: 'Skip the current song',
    
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

        try {
            await queue.skip();
            message.react('⏭️');
        } catch (error) {
            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`${emojis.error} ${error.message}`)
                ]
            });
        }
    }
};
