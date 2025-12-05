const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');

const questions = [
    { q: "Apa ibukota Indonesia?", a: ["Jakarta", "Bandung", "Surabaya", "Medan"], correct: 0 },
    { q: "Berapa hasil 8 x 7?", a: ["54", "56", "58", "64"], correct: 1 },
    { q: "Planet terdekat dari matahari?", a: ["Venus", "Mars", "Merkurius", "Bumi"], correct: 2 },
    { q: "Siapa penemu lampu pijar?", a: ["Newton", "Einstein", "Edison", "Tesla"], correct: 2 },
    { q: "Tahun kemerdekaan Indonesia?", a: ["1944", "1945", "1946", "1947"], correct: 1 },
    { q: "Hewan tercepat di darat?", a: ["Singa", "Cheetah", "Harimau", "Kuda"], correct: 1 },
    { q: "Berapa jumlah provinsi di Indonesia?", a: ["34", "36", "38", "40"], correct: 2 },
    { q: "Bahasa pemrograman untuk web?", a: ["Python", "Java", "JavaScript", "C++"], correct: 2 }
];

module.exports = {
    name: 'trivia',
    aliases: ['quiz', 'tebak'],
    description: 'Main trivia quiz',
    cooldown: config.cooldowns.trivia,
    
    async execute(message, args, client) {
        const question = questions[Math.floor(Math.random() * questions.length)];
        
        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('🎯 Trivia Quiz')
            .setDescription(`**${question.q}**\n\nKlik jawaban yang benar dalam ${config.trivia.timeLimit / 1000} detik!`)
            .setFooter({ text: `Diminta oleh ${message.author.username}` });

        const buttons = question.a.map((answer, i) => 
            new ButtonBuilder()
                .setCustomId(`trivia_${i}`)
                .setLabel(answer)
                .setStyle(ButtonStyle.Primary)
        );

        const row = new ActionRowBuilder().addComponents(buttons);
        const msg = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === message.author.id;
        
        try {
            const interaction = await msg.awaitMessageComponent({ filter, time: config.trivia.timeLimit });
            const selectedIndex = parseInt(interaction.customId.split('_')[1]);
            
            let player = await client.Player.findOne({ odId: message.author.id });
            if (!player) {
                player = new client.Player({ odId: message.author.id });
            }

            if (selectedIndex === question.correct) {
                player.triviaScore += config.trivia.pointsCorrect;
                player.gold += 5;
                await player.save();

                const successEmbed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Benar!')
                    .setDescription(`Jawabannya adalah **${question.a[question.correct]}**!\n\n+${config.trivia.pointsCorrect} points\n+5 gold`)
                    .addFields({ name: 'Total Score', value: `${player.triviaScore} points` });

                await interaction.update({ embeds: [successEmbed], components: [] });
            } else {
                player.triviaScore += config.trivia.pointsWrong;
                await player.save();

                const failEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Salah!')
                    .setDescription(`Jawaban yang benar adalah **${question.a[question.correct]}**!\n\n${config.trivia.pointsWrong} points`);

                await interaction.update({ embeds: [failEmbed], components: [] });
            }
        } catch (error) {
            const timeoutEmbed = new EmbedBuilder()
                .setColor('#ffff00')
                .setTitle('⏰ Waktu Habis!')
                .setDescription(`Jawaban yang benar adalah **${question.a[question.correct]}**`);

            await msg.edit({ embeds: [timeoutEmbed], components: [] });
        }
    }
};
