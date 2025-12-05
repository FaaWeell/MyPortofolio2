const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'autoplay',
    aliases: ['ap'],
    description: 'Toggle autoplay mode',
    
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

        const autoplay = queue.toggleAutoplay();
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(embedColor)
                    .setDescription(`🔄 Autoplay is now **${autoplay ? 'ON' : 'OFF'}**`)
            ]
        });
    }
};
