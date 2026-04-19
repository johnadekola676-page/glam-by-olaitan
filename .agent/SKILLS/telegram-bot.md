# Skill: Telegram Bot Setup

## Recommended Libraries
- Node.js: Telegraf — <https://github.com/telegraf/telegraf>
- Python: Aiogram — <https://github.com/aiogram/aiogram>
- Python simple: python-telegram-bot — <https://github.com/python-telegram-bot/python-telegram-bot>

## Create a Bot (one time)
1. Open Telegram → search @BotFather → start
2. Send `/newbot`
3. Give it a display name and a username (must end in `bot`)
4. Copy the token → save to Railway env as `TELEGRAM_BOT_TOKEN`

## Node.js — Telegraf with Express (Webhook for Production)
```bash
npm install telegraf express
```

```jsx
// bot.js
const { Telegraf } = require('telegraf')
const express = require('express')

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
const app = express()

app.use(express.json())

// Commands
bot.command('start', ctx => ctx.reply('Welcome! How can I help you?'))
bot.on('text', ctx => ctx.reply(`You said: ${ctx.message.text}`))

// Webhook (use in production on Railway)
const webhookPath = '/webhook'
app.use(bot.webhookCallback(webhookPath))

const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
  const url = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}${webhookPath}`
  await bot.telegram.setWebhook(url)
  console.log(`Bot running. Webhook set to ${url}`)
})
```

## Set Webhook Manually

```bash
curl -X POST <https://api.telegram.org/bot[TOKEN]/setWebhook> \
  -H "Content-Type: application/json" \
  -d '{"url": "<https://your-app.railway.app/webhook>"}'
```

## Verify Webhook

```bash
curl <https://api.telegram.org/bot[TOKEN]/getWebhookInfo>
```

## Railway Env Vars Needed

```
TELEGRAM_BOT_TOKEN=your_token
RAILWAY_PUBLIC_DOMAIN=your-app.railway.app  (auto-set by Railway)
PORT=3000
```

## Note

Every time the Railway domain changes (rare but happens), reset the webhook with the new URL.
Add this auto-set on startup like shown in the code above.
