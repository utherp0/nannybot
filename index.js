// Basic structure lifted from smarlands nominate-bot

// Imports
const Telegraf = require('telegraf');
const fetch = require('isomorphic-fetch');
const session = require('telegraf/session');
const https = require('https');
const fs = require('fs');

// Pull in Imports
const telegramToken = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(telegramToken);

// Use Telegraf Session
bot.use(session());

// Setup basic logging
bot.use((ctx, next) => 
{
  const start = new Date();
  return next().then(() => 
  {
    const elapsed = new Date() - start;
        console.log('response time %sms', elapsed);
  });
});

// Process messages
bot.hears(/^nominate$/i, (ctx) => 
{
  if( !ctx.message.reply_to_message ) 
  {
    ctx.replyWithMarkdown(`Please reply to the message you want to nominate`);
  } 
  else 
  {
    data = 
    {
      nominee: ctx.message.reply_to_message.from.first_name + " " + ctx.message.reply_to_message.from.last_name,
      message: ctx.message.reply_to_message.text,
      nominator: ctx.message.from.first_name + " " + ctx.message.from.last_name,
      date: new Date().toString(),
      channel: ctx.message.chat.title,
      linkToGif: "N/A",
      linkToPhoto: "N/A"
    };
            
    ctx.replyWithMarkdown(`Message received`);
            
    console.log("Message the was nominated was " + ctx.message.reply_to_message.text + "\nNominated By " + ctx.message.reply_to_message.from.first_name + " " + ctx.message.reply_to_message.from.last_name);
  }
});

bot.startPolling();
