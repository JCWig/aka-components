'use strict';

var istanbul = require('browserify-istanbul');

module.exports = function(config) {
    config.set({
        files: [
            'node_modules/angular/angular.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/pulsar-common-css/dist/styles.css',
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'src/**/*.js',
            'test/**/*.js'
        ],
        frameworks: ['browserify', 'mocha', 'chai', 'sinon-chai'],
        preprocessors: {
            'src/*/*.js': ['browserify']
        },
        browsers: ['PhantomJS'],
        reporters: ['spec', 'coverage'],
        browserify: {
            debug: true,
            transform: [
                istanbul({
                    ignore: ['**/*.html', 'test/**/*.spec.js']
                })
            ]
        },
        coverageReporter: {
            dir: 'reports/coverage/',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ]
        }
    });
};
