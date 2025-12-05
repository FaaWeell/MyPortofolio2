require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.activeGames = new Collection();

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('[GameHub] Connected to MongoDB'))
    .catch(err => console.error(err));

// Player Schema
const playerSchema = new mongoose.Schema({
    odId: String,
    odId: String,
    odId: String,
    gold: { type: Number, default: config.rpg.startingGold },
    hp: { type: Number, default: config.rpg.startingHP },
    maxHp: { type: Number, default: config.rpg.startingHP },
    attack: { type: Number, default: config.rpg.startingAttack },
    defense: { type: Number, default: config.rpg.startingDefense },
    level: { type: Number, default: 1 },
    exp: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    triviaScore: { type: Number, default: 0 },
    inventory: [{ item: String, quantity: Number }],
    lastAdventure: Date,
    lastDaily: Date
});

const Player = mongoose.model('Player', playerSchema);
client.Player = Player;

// Load Commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.name) {
        client.commands.set(command.name, command);
    }
}

client.on('ready', () => {
    console.log(`[GameHub] ${client.user.tag} is online!`);
    client.user.setActivity('!help | GameHub', { type: 0 });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || 
                    client.commands.find(c => c.aliases && c.aliases.includes(commandName));

    if (!command) return;

    // Cooldown check
    const cooldownKey = `${command.name}_${message.author.id}`;
    if (client.cooldowns.has(cooldownKey)) {
        const timeLeft = (client.cooldowns.get(cooldownKey) - Date.now()) / 1000;
        return message.reply(`Tunggu **${timeLeft.toFixed(1)}s** sebelum menggunakan command ini lagi!`);
    }

    try {
        await command.execute(message, args, client);
        
        if (command.cooldown) {
            client.cooldowns.set(cooldownKey, Date.now() + command.cooldown);
            setTimeout(() => client.cooldowns.delete(cooldownKey), command.cooldown);
        }
    } catch (error) {
        console.error(error);
        message.reply('Terjadi error!');
    }
});

client.login(process.env.BOT_TOKEN);
