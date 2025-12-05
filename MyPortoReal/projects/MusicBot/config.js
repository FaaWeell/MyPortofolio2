require('dotenv').config();

module.exports = {
    token: process.env.BOT_TOKEN,
    clientId: process.env.CLIENT_ID,
    prefix: process.env.PREFIX || '!',
    
    embedColor: '#5865F2',
    
    emojis: {
        play: '▶️',
        pause: '⏸️',
        stop: '⏹️',
        skip: '⏭️',
        queue: '📋',
        music: '🎵',
        volume: '🔊',
        loop: '🔁',
        error: '❌',
        success: '✅'
    }
};
