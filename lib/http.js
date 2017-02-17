/**
 * The MIT License (MIT)
 * Copyright (c) 2017 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 *
 * The HTTP client.
 */


exports = module.exports = {
    /**
     * Bridge a request.
     * @kind function
     * @param  {String} token
     * @param  {Object} [options]
     * @param  {String} [options.path=/]
     * @param  {String} [options.method=GET]
     * @param  {Object} [options.qs={}]
     * @param  {Object} [options.body={}]
     * @param  {String} [options.baseUrl=constants.PLANK_URL]
     * @param  {Function} done(error, response, httpIncomingMessage)
     */
    bridge,
};


// npm-installed modules
const Debug = require("debug");
const Request = require("request");


// own modules
const constants = require("./constants");
const pkg = require("../package.json");


// module variables
const debug = Debug("plank:client:http");
const request = Request.defaults({ json: true });


function bridge(token, options, done) {
    if (!done) {
        done = options;
        options = {};
    }
    options.path = options.path || "/";
    options.method = options.method || "POST";
    options.qs = options.qs || {};
    options.body = options.body || {};
    options.baseUrl = options.baseUrl || constants.PLANK_URL;
    const url = `${options.baseUrl}/bridge/${token}${options.path}`;
    debug("url: %s", url);
    return request({
        url,
        method: options.method,
        headers: {
            "User-Agent": `plank/cli@${pkg.version}`,
        },
        qs: options.qs,
        body: options.body,
    }, function(errRequest, response, body) {
        return done(errRequest, body, response);
    });
}
