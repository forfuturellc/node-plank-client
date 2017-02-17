/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Mohammed Sohail <sohail@forfuture.tech>
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 *
 * Demonstrating how to use the WebSocket client to process Github webhook updates and telegram, at the same time!
 */
/* eslint-disable no-console */


// own modules
const plank = require('..');

// module variables
const token = process.argv[2] || 'public';
const client = new plank.WebSocket(token);
const telegram = {
    token: process.env.TELEGRAM_TOKEN,
    chat_id: process.env.CHAT_ID
};
const github = {
    token: process.env.GITHUB_TOKEN,
    username: process.env.GITHUB_USERNAME,
    repo: process.env.GITHUB_REPO,
};

// npm-installed modules
const request = require('request');

// set webhook after plank connection
client.on('ready', () => {
    console.log('Client ready');
    const opts = {
        url: `https://api.github.com/repos/${github.username}/${github.repo}/hooks`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + github.token,
            'User-Agent': 'node-plank-client/0.1'
        },
        body: JSON.stringify({
            'name': 'web',
            'active': true,
            'events': ['push'],
            'config': {
                'url': client.urls.websocket.replace(/^ws/, 'http'),
                'content-type': 'json'
            }
        })
    };
    request.post(opts);
});

// listen for messages and process github payload then send via telegram transport
client.on('message', payload => {
    let ctx = JSON.parse(payload.body.payload);
    let msg = `*Commit: *${ctx.commits[0].id}\n*Message: *${ctx.commits[0].message}\n*By: *${ctx.commits[0].author.name}`;
    let opts = {
        url: `https://api.telegram.org/bot${telegram.token}/sendMessage`,
        qs: {
            'chat_id': telegram.chat_id,
            'text': msg,
            'parse_mode': 'Markdown'
        }
    };
    request.get(opts);
});

// handle errors
client.on('error', error => {
    console.error(error);
    process.exit(1);
});
