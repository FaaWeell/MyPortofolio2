module.exports = {
    prefix: '!',
    embedColor: '#5865F2',
    
    // Anti-Spam Settings
    antiSpam: {
        maxMessages: 5,
        timeWindow: 5000,
        muteTime: '10m',
        warnThreshold: 3
    },
    
    // Anti-Raid Settings
    antiRaid: {
        maxJoins: 10,
        timeWindow: 10000,
        lockdownDuration: '5m'
    },
    
    // Auto-Mod Settings
    autoMod: {
        bannedWords: ['spam', 'scam', 'nitro free'],
        maxMentions: 5,
        maxEmojis: 10,
        linkWhitelist: ['discord.gg', 'youtube.com', 'github.com']
    },
    
    // Logging
    logChannel: null
};
