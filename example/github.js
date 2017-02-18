/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Mohammed Sohail <sohail@forfuture.tech>
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 *
 * Demonstrating how to use the WebSocket client to process Github webhook updates and telegram, at the same time!
 */
/* eslint-disable no-console */


// npm-installed modules
const request = require("request");

// own modules
const plank = require("..");

// module variables
const token = process.argv[2] || "public";
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

// set webhook after plank connection
client.on("ready", () => {
    console.log("Client ready");
    const opts = {
        url: `https://api.github.com/repos/${github.username}/${github.repo}/hooks`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/vnd.github.v3+json",
            "Authorization": "token " + github.token,
            "User-Agent": "node-plank-client/0.1"
        },
        body: JSON.stringify({
            "name": "web",
            "active": true,
            "events": ["push"],
            "config": {
                "url": client.urls.websocket.replace(/^ws/, "http"),
                "content-type": "json"
            }
        })
    };
    request.post(opts, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log(error);
        }
    });
});

// listen for messages and process github payload
client.on("message", payload => {
    let ctx = JSON.parse(payload.body.payload);
    let msg = `Commit: ${ctx.commits[0].id}
               Message: ${ctx.commits[0].message}
               By: ${ctx.commits[0].author.name}`;
    // handle the data sent by github
    console.log(msg);

});

// handle errors
client.on("error", error => {
    console.error(error);
    process.exit(1);
});
