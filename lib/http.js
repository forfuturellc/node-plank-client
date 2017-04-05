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
     * @param  {Function} done(error, body, response)
     */
    bridge,
    /**
     * Send a payload as a HTTP request.
     * This is useful when "proxying" between Plank and a
     * local WebHook.
     * @kind function
     * @param  {String} url
     * @param  {Payload} payload
     * @param  {Function} done(error, body, response)
     */
    request,
};


// npm-installed modules
const Request = require("request");


// own modules
const constants = require("./constants");
const pkg = require("../package.json");


// module variables
const httpRequest = Request.defaults({ json: true });


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
    return request(options.baseUrl, {
        path: `/bridge/${token}${options.path}`,
        method: options.method,
        qs: options.qs,
        body: options.body,
    }, done);
}


function request(baseUrl, payload, done) {
    return httpRequest({
        baseUrl,
        uri: payload.path,
        method: payload.method,
        headers: {
            "User-Agent": `plank/cli@${pkg.version}`,
        },
        qs: payload.qs,
        body: payload.body,
    }, function(error, response, body) {
        return done(error, body, response);
    });
}
