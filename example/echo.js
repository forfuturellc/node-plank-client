/**
 * The MIT License (MIT)
 * Copyright (c) 2017 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 *
 * Demonstrating how to use the WebSocket client.
 */
/* eslint-disable no-console */


// built-in modules
const http = require("http");


// module variables
const port = process.argv[2];
if (!port) {
    throw new Error("port missing");
}
const server = http.Server(requestListener);


function requestListener(req, res) {
    const date = new Date();
    console.log("[%s] New request. Echo back.", date.toTimeString());
    res.writeHead(200, {
        "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ ok: true }));
}


server.listen(port, "127.0.0.1", function() {
    const date = new Date();
    console.log("[%s] server listening on port %d", date.toTimeString(), port);
});
