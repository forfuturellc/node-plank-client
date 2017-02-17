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
const token = process.argv[2] || "public";
const client = new plank.WebSocket(token);


console.log("HTTP:      %s", client.urls.websocket.replace(/^ws/, "http"));
console.log("WebSocket: %s", client.urls.websocket);


client.on("ready", function() {
    console.log("Client ready");
    console.log("");
});


// listen for messages
client.on("message", function(payload) {
    const date = new Date();
    console.log("[%s] New Request:", date.toTimeString());
    console.log("  path   =", payload.path);
    console.log("  method =", payload.method);
    console.log("  qs     =", payload.qs);
    console.log("  body   =", payload.body);
    console.log("");
});


// handle errors
client.on("error", function(error) {
    console.error(error);
    process.exit(1);
});
