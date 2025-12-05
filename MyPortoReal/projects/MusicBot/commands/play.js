const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Play a song from YouTube/Spotify/SoundCloud',
    usage: '<song name or URL>',
    
    async execute(message, args, client) {
        const { emojis, embedColor } = client.config;
        
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`${emojis.error} You must be in a voice channel!`)
                ]
            });
        }

        const query = args.join(' ');
        if (!query) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(`${emojis.error} Please provide a song name or URL!`)
                ]
            });
        }

        try {
            await message.react('🎵');
            await client.distube.play(voiceChannel, query, {
                textChannel: message.channel,
                member: message.member
            });
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
