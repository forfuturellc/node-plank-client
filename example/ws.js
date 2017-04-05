/**
 * The MIT License (MIT)
 * Copyright (c) 2017 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 *
 * Demonstrating how to use the WebSocket client.
 */
/* eslint-disable no-console */


// own modules
const plank = require("..");


// module variables
const token = process.env.PLANK_TOKEN || "public";
const client = new plank.WebSocket(token);
const proxy = process.argv[2];


console.log("HTTP:      %s", client.urls.http);
console.log("WebSocket: %s", client.urls.websocket);


client.on("ready", function() {
    console.log("Client ready");
    console.log("");
});


// listen for messages
client.on("message", function(payload) {
    const date = new Date();
    console.log("[%s]\nNew Request:", date.toTimeString());
    console.log("  path   =", payload.path);
    console.log("  method =", payload.method);
    console.log("  qs     =", payload.qs);
    console.log("  body   =", payload.body);
    if (!proxy) {
        console.log("");
        return;
    }

    console.log("Proxying to:", proxy);
    plank.http.request(proxy, payload, function(error, body) {
        if (error) {
            console.error("Error occurred during proxying:");
            console.error(indent(error.message));
            return;
        }
        const msg = JSON.stringify(body, null, 2);
        console.log(indent(msg));
    });
    function indent(text) {
        return text.split("\n").map(l => `  ${l}`).join("\n");
    }
});


// handle errors
client.on("error", function(error) {
    console.error(error);
    process.exit(1);
});
