/**
 * The MIT License (MIT)
 * Copyright (c) 2017 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 *
 * The WebSocket client.
 */


// built-in modules
const EventEmitter = require("events");


// npm-installed modules
const WebSocket = require("ws");


// own modules
const constants = require("./constants");


/** WebSocketClient */
class WebSocketClient extends EventEmitter {
    /**
     * Emits `ready`, `message`, `error` events.
     * @class WebSocketClient
     * @constructor
     * @param  {String} token
     * @param  {Object} [options]
     * @param  {String} [options.baseUrl] Defaults to `constants.PLANK_URL`
     */
    constructor(token, options={}) {
        super();
        this.token = token;
        this.options = options;
        this.options.baseUrl = options.baseUrl || constants.PLANK_URL;
        this.urls = {};
        this.urls.base = this.options.baseUrl.replace(/^http/, "ws");
        this.urls.websocket = `${this.urls.base}/bridge/${this.token}`;
        this.urls.http = this.urls.websocket.replace(/^ws/, "http");
        this._client = new WebSocket(this.urls.websocket);
        this._client.on("open", () => {
            this.emit("ready");
        });
        this._client.on("message", (message) => {
            this._processMessage(message);
        });
        this._client.on("error", (error) => {
            this.emit("error", error);
        });
    }

    /**
     * Process the message.
     * On success, emits `message` event, passing a payload object.
     * On error, emits `error` event, passing an error object.
     * @private
     * @param  {String} data
     */
    _processMessage(data) {
        let payload;
        try {
            payload = JSON.parse(data);
        } catch(ex) {
            const error = new Error("Error parsing message");
            error.code = "EPARSE";
            error.data = data;
            return this.emit("error", error);
        }
        if (payload.error) {
            const error = new Error(payload.error.description);
            error.code = payload.error.code;
            error.data = data;
            error.payload = payload;
            return this.emit("error", error);
        }
        const invalid = ["path", "method", "qs", "body"].some(prop => {
            return !payload[prop];
        });
        if (invalid) {
            const error = new Error("Invalid Payload");
            error.code = "EPAYLOAD";
            error.data = data;
            error.payload = payload;
            return this.emit("error", error);
        }
        this.emit("message", payload);
    }
}


exports = module.exports = WebSocketClient;
