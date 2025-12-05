module.exports = {
    prefix: '!',
    embedColor: '#FF6B6B',
    
    // Game Settings
    trivia: {
        timeLimit: 30000,
        pointsCorrect: 10,
        pointsWrong: -5
    },
    
    rpg: {
        startingGold: 100,
        startingHP: 100,
        startingAttack: 10,
        startingDefense: 5
    },
    
    // Cooldowns (ms)
    cooldowns: {
        trivia: 10000,
        adventure: 60000,
        daily: 86400000
    }
};
