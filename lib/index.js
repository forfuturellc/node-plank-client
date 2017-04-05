/**
 * The MIT License (MIT)
 * Copyright (c) 2017 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 *
 * Client for Plank.
 */


/**
 * A payload, representing a HTTP request.
 * @typedef  {Object} Payload
 * @property {String} path
 * @property {String} method
 * @property {Object} qs
 * @property {Object} body
 */


// own modules
const cli = require("./cli");
const constants = require("./constants");
const http = require("./http");
const WebSocket = require("./ws");


exports = module.exports = {
    cli,
    constants,
    http,
    WebSocket,
};
