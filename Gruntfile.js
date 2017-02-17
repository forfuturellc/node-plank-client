/**
 * The MIT License (MIT)
 * Copyright (c) 2017 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2017 Forfuture, LLC <we@forfuture.co.ke>
 *
 * Task runner.
 */


// npm-installed modules
const loadTasks = require("load-grunt-tasks");


exports = module.exports = function(grunt) {
    loadTasks(grunt);

    grunt.initConfig({
        eslint: {
            target: [
                "example/**/*.js",
                "lib/**/*.js",
                "test/**/*.js",
                "Gruntfile.js",
            ],
        },
    });

    grunt.registerTask("testenv", "mark env as testing", function() {
        process.env.NODE_ENV = "testing";
    });
    grunt.registerTask("lint", ["eslint"]);
    grunt.registerTask("test", ["testenv", "lint"]);
};
