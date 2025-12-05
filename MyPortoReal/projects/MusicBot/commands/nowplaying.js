const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'nowplaying',
    aliases: ['np', 'now', 'playing'],
    description: 'Show the currently playing song',
    
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

        const song = queue.songs[0];
        const current = queue.currentTime;
        const total = song.duration;
        const progress = Math.round((current / total) * 20);
        const progressBar = '▬'.repeat(progress) + '🔘' + '▬'.repeat(20 - progress);

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setAuthor({ name: 'Now Playing', iconURL: 'https://cdn.discordapp.com/emojis/741605543046807626.gif' })
            .setTitle(song.name)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setDescription(`${progressBar}\n\n\`${queue.formattedCurrentTime} / ${song.formattedDuration}\``)
            .addFields(
                { name: '👤 Requested by', value: `${song.user}`, inline: true },
                { name: '🔊 Volume', value: `${queue.volume}%`, inline: true },
                { name: '🔁 Loop', value: queue.repeatMode === 0 ? 'Off' : queue.repeatMode === 1 ? 'Song' : 'Queue', inline: true }
            );

        message.reply({ embeds: [embed] });
    }
};
