const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'queue',
    aliases: ['q', 'list'],
    description: 'Show the current queue',
    
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
        const queueList = queue.songs
            .slice(1, 11)
            .map((song, i) => `**${i + 1}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``)
            .join('\n') || 'No songs in queue';

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setAuthor({ name: `Queue for ${message.guild.name}`, iconURL: message.guild.iconURL() })
            .setDescription(`**Now Playing:**\n[${song.name}](${song.url}) - \`${song.formattedDuration}\`\n\n**Up Next:**\n${queueList}`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `${queue.songs.length} songs in queue | Volume: ${queue.volume}%` });

        message.reply({ embeds: [embed] });
    }
};
