require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('[Dashboard] Connected to MongoDB'))
    .catch(err => console.error(err));

// Guild Settings Schema
const guildSchema = new mongoose.Schema({
    guildId: String,
    prefix: { type: String, default: '!' },
    welcomeChannel: String,
    welcomeMessage: String,
    logChannel: String,
    autoRole: String,
    antiSpam: { type: Boolean, default: false },
    antiRaid: { type: Boolean, default: false }
});

const Guild = mongoose.model('Guild', guildSchema);

// Passport Discord Strategy
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Auth Middleware
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
};

// Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/login', passport.authenticate('discord'));

app.get('/auth/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

app.get('/dashboard', isAuthenticated, async (req, res) => {
    const guilds = req.user.guilds.filter(g => (g.permissions & 0x20) === 0x20);
    res.render('dashboard', { user: req.user, guilds });
});

app.get('/dashboard/:guildId', isAuthenticated, async (req, res) => {
    const { guildId } = req.params;
    const guild = req.user.guilds.find(g => g.id === guildId);
    
    if (!guild || (guild.permissions & 0x20) !== 0x20) {
        return res.redirect('/dashboard');
    }

    let settings = await Guild.findOne({ guildId });
    if (!settings) {
        settings = new Guild({ guildId });
        await settings.save();
    }

    res.render('guild', { user: req.user, guild, settings });
});

app.post('/api/guild/:guildId', isAuthenticated, async (req, res) => {
    const { guildId } = req.params;
    const { prefix, welcomeChannel, welcomeMessage, logChannel, antiSpam, antiRaid } = req.body;

    await Guild.findOneAndUpdate(
        { guildId },
        { prefix, welcomeChannel, welcomeMessage, logChannel, antiSpam, antiRaid },
        { upsert: true }
    );

    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[Dashboard] Running on http://localhost:${PORT}`);
});
