# 🛡️ Guardian Bot

Bot keamanan Discord dengan fitur anti-raid, anti-spam, dan auto-moderation.

## Features

- **Anti-Spam** - Deteksi dan penanganan spam otomatis
- **Anti-Raid** - Proteksi dari serangan raid (mass join)
- **Auto-Mod** - Filter kata terlarang, mention berlebihan
- **Moderation Commands** - warn, kick, ban, mute, purge, lockdown

## Installation

```bash
# Clone atau download project
cd GuardianBot

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan token bot kamu

# Jalankan bot
npm start
```

## Commands

| Command | Deskripsi |
|---------|-----------|
| `!help` | Tampilkan daftar command |
| `!warn @user [alasan]` | Beri warning ke member |
| `!kick @user [alasan]` | Kick member dari server |
| `!ban @user [alasan]` | Ban member dari server |
| `!mute @user [durasi] [alasan]` | Mute member (contoh: 10m, 1h) |
| `!purge [jumlah]` | Hapus pesan (1-100) |
| `!lockdown [off]` | Lock atau unlock channel |

## Configuration

Edit `config.js` untuk mengatur:

- **Anti-Spam**: Max messages, time window, mute duration
- **Anti-Raid**: Max joins per time, lockdown duration
- **Auto-Mod**: Banned words, max mentions, link whitelist

## Tech Stack

- Node.js
- Discord.js v14
- MySQL

## Author

**Fajri Fajar Shidik** - [GitHub](https://github.com/fajrifajar)
