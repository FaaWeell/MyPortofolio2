# 🎵 MusicMaster Bot

Discord Music Bot dengan fitur lengkap - support YouTube, Spotify, dan SoundCloud.

## ✨ Features

- 🎶 Play music from YouTube, Spotify, SoundCloud
- 📋 Queue system
- 🔁 Loop (song/queue)
- 🔀 Shuffle
- 🔊 Volume control
- ⏩ Seek
- 🔄 Autoplay
- 📊 Now playing with progress bar

## 📦 Installation

### 1. Clone & Install Dependencies

```bash
cd MusicBot
npm install
```

### 2. Setup Environment

Copy `.env.example` ke `.env` dan isi dengan token bot kamu:

```env
BOT_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_client_id_here
PREFIX=!
```

### 3. Install FFmpeg

**Windows:**
- Download dari https://ffmpeg.org/download.html
- Extract dan tambahkan ke PATH

**Linux:**
```bash
sudo apt install ffmpeg
```

### 4. Run Bot

```bash
npm start
```

Atau untuk development:
```bash
npm run dev
```

## 🎮 Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `!play <song>` | `!p` | Play a song |
| `!pause` | - | Pause the song |
| `!resume` | `!r` | Resume the song |
| `!skip` | `!s` | Skip current song |
| `!stop` | `!dc` | Stop and leave |
| `!queue` | `!q` | Show queue |
| `!nowplaying` | `!np` | Show current song |
| `!volume <0-100>` | `!vol` | Set volume |
| `!loop [off/song/queue]` | `!lp` | Toggle loop |
| `!shuffle` | `!mix` | Shuffle queue |
| `!seek <seconds>` | - | Seek position |
| `!autoplay` | `!ap` | Toggle autoplay |
| `!help` | `!h` | Show commands |

## 🔧 Requirements

- Node.js 16.9.0+
- FFmpeg
- Discord Bot Token

## 📝 Getting Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application
3. Go to Bot section
4. Click "Add Bot"
5. Copy the token

## 🔗 Bot Invite Link

Replace `CLIENT_ID` with your bot's client ID:

```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=3147776&scope=bot
```

## 👤 Author

**Fajri Fajar Shidik**
- Discord: fajri_fajar
- GitHub: @fajrifajar

## 📄 License

MIT License
