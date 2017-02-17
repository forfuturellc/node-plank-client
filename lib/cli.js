/**
 * The MIT License (MIT)
 * Copyright (c) 2017 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 *
 * The CLI Client.
 */
/* eslint-disable no-console */


exports = module.exports = {
    run,
};


// built-in modules
const http = require("http");
const repl = require("repl");


// npm-installed modules
const chalk = require("chalk");
const Debug = require("debug");
const inquirer = require("inquirer");
const out = require("cli-output");
const parser = require("commander");


// own modules
const httpClient = require("./http");
const pkg = require("../package.json");


// module variables
const debug = Debug("plank:client:cli");


parser
    .version(pkg.version)
    .option("-b, --base-url <url>", "base url to plank")
    ;


parser
    .command("bridge")
    .description("bridge a request")
    .option("-t, --token <token>", "auth token; prompted if missing")
    .option("-i, --interactive", "start an interactive repl")
    .option("-a, --args <args>", "bridge arguments")
    .option("-r, --raw", "show raw server response")
    .action(function(options) {
        return inquirer.prompt([
            {
                type: "password",
                name: "token",
                message: "Auth Token",
                when() {
                    return !options.token;
                },
            },
        ]).then(function(answers) {
            options.token = answers.token || options.token;
            if (options.interactive) {
                return runRepl(options);
            }
            return fireRequest(options);
        });
    })
    ;


function evalBridgeArgs(string) {
    let args = {
        path: "/",
        method: "POST",
        qs: {},
        body: {},
    };
    string = string.trim();
    if (!string) {
        return args;
    }
    let match;
    string.split(" ").forEach(function(part) {
        if (!part) return;

        // method
        if (http.METHODS.indexOf(part.toUpperCase()) !== -1) {
            args.method = part;
            return;
        }

        // path
        match = /\/\w+/.exec(part);
        if (match) {
            args.path = part;
            return;
        }

        // querystring
        match = /(\w+)==(\w+)/.exec(part);
        if (match) {
            args.qs[match[1]] = match[2];
            return;
        }

        // body
        match = /(\w+)=(\w+)/.exec(part);
        if (match) {
            args.body[match[1]] = match[2];
            return;
        }
        throw new Error(`unrecognized parameter: ${part}`);
    });
    return args;
}


function writeServerResponse(res, options) {
    if (options.raw) {
        return out.rjson(res);
    }
    return out.pjson(res);
}


function runRepl(options) {
    return repl.start({
        prompt: "bridge> ",
        eval,
        ignoreUndefined: true,
    });
    function eval(cmd, context, filename, done) {
        let args;
        try { args = evalBridgeArgs(cmd); }
        catch (ex) {
            return done(chalk.red(ex.message));
        }
        debug("token: %s", options.token);
        debug("args: %j", args);
        return httpClient.bridge(options.token, args, function(error, res) {
            if (error) {
                return done(error);
            }
            writeServerResponse(res, options);
            return done(null);
        });
    }
}


function fireRequest(options) {
    let args;
    try { args = evalBridgeArgs(options.args || ""); }
    catch (ex) {
        console.error(chalk.red(ex.message));
        return process.exit(1);
    }
    debug("token: %s", options.token);
    debug("args: %j", args);
    return httpClient.bridge(options.token, args, function(error, res) {
        if (error) {
            console.error(chalk.red(error.message));
            return process.exit(1);
        }
        return writeServerResponse(res, options);
    });
}


function run() {
    parser.parse(process.argv);
    if (process.argv.length  === 2) {
        return parser.outputHelp();
    }
}
