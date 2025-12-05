module.exports = {
    prefix: '!',
    embedColor: '#5865F2',
    
    // Leveling System
    leveling: {
        xpPerMessage: 15,
        xpCooldown: 60000,
        levelUpChannel: null
    },
    
    // Economy System
    economy: {
        currency: 'coins',
        dailyReward: 100,
        workReward: { min: 50, max: 200 },
        workCooldown: 3600000
    },
    
    // Moderation
    moderation: {
        warnExpiry: 7 * 24 * 60 * 60 * 1000,
        maxWarns: 3,
        autoMute: true
    }
};
