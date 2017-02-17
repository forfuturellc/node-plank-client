/**
 * The MIT License (MIT)
 * Copyright (c) 2017 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 *
 * Demonstrating how to use the HTTP client.
 */
/* eslint-disable no-console */


// own modules
const plank = require("..");


// module variables
const token = process.argv[2] || "public";


plank.http.bridge(token, {
    path: "/hello",
    method: "POST",
    qs: {
        hello: "world",
    },
    body: {
        hello: "world",
    },
}, function(error, response) {
    if (error) {
        console.error(error);
        return process.exit(1);
    }
    console.log(response);
});
