require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
		gyro: "lib/gyro.min",
        anim: "lib/animation"
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
		'gyro': {
            exports: 'gyro'
        },
        'anim': {
            exports: 'requestAnimationFrame'
        }
    }
});

define([
    'router'
], function(
    router
){
    Backbone.history.start();
});
