// Basic structure lifted from smarlands nominate-bot

// Imports
const Telegraf = require('telegraf');
const fetch = require('isomorphic-fetch');
const session = require('telegraf/session');
const https = require('https');
const fs = require('fs');
const request = require('request');

// Pull in ENVs
const telegramToken = process.env.NANNYBOT;
const healthCheckURL = process.env.NANNYHEALTHCHECK;

// Define the bot
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
    console.log('[NannyBot] Saw message in %sms', elapsed);
  });
});

// Global message handler
bot.on('text', ctx =>
{
  const messager = ctx.message.from.first_name + " " + ctx.message.from.last_name;
  ctx.replyWithMarkdown('Saw message "' + ctx.message.text + '" from (' + messager + ')');
  if( ctx.message.text.indexOf( "nanny") != -1 || 
      ctx.message.text.indexOf( "Nanny") != -1 )
  {
    ctx.replyWithMarkdown('  Saw mention of self' );
  }

  if( ctx.message.text.indexOf('healthcheck') != -1 )
  {
    var target = "http://nannybotbackend-botbackend.apps.conroe.demolab.local/api/health/check";
    request.get(target, (error, response, body) =>
    {
      if( error )
      {
        ctx.replyWithMarkdown("NannyBot backend reports an error.");
        return;
      }

      if( response.statusCode == 200 )
      {
        ctx.replyWithMarkdown("NannyBot backend reports healthy.");
      }
      else
      {
        ctx.replyWithMarkdown('NannyBot backend reports unhealthy (' + response.statusCode + ')');
      }
    });
  }

  if( ctx.message.text.indexOf( "murphy" ) != -1 )
  {
    var target = "http://meowworld-sandbox.e8ca.engint.openshiftapps.com/cat/murphy"; 
    request.get(target, (error, response, body) =>
    {
      if( error ) 
      {
        ctx.replyWithMarkdown("Unable to reference Webservice");
        return;
      }

      ctx.replyWithMarkdown("NannyBot called " + target );
      ctx.replyWithMarkdown("Webservice response: " + body);
    });
  }
});

// Process messages
bot.hears(/^(N|n)anny*/i, (ctx) =>
{
  ctx.replyWithMarkdown('Heard ' + ctx.message);
});

bot.hears(/^TEST$/i, (ctx) => 
{
  ctx.replyWithMarkdown('Heard fixed term TEST from ' + ctx.message.from.last_name + "," + ctx.message.from.first_name );
});

bot.startPolling();
