/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Mohammed Sohail <sohail@forfuture.tech>
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 *
 * Demonstrating how to use the WebSocket client to process Telegram Bot API updates in Node.js.
 */
/* eslint-disable no-console */


// npm-installed modules
const TelegramBot = require("node-telegram-bot-api");

// own modules
const plank = require("..");

// module variables
const token = process.argv[2] || "public";
const botToken = process.env.TELEGRAM_TOKEN;
const client = new plank.WebSocket(token);

// setup bot
const bot = new TelegramBot(botToken);

// set webhook after plank connection
client.on("ready", () => {
    console.log("Client ready");
    bot.setWebHook(client.urls.websocket.replace(/^ws/, "http")).then(ctx => {
        ctx == true ? console.log("Webhook was set!") : console.log("Error: Webhook could not be set");
    }).catch(err => {
        console.log(err);
    });
});

// listen for messages and process bot updates
client.on("message", payload => {
    bot.processUpdate(payload.body);
});

// handle errors
client.on("error", error => {
    console.error(error);
    process.exit(1);
});

// just to ping!
bot.on("message", msg => {
    bot.sendMessage(msg.chat.id, "I am alive!");
});
