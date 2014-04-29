require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        anim: "lib/animation",
        Connector: "lib/Connector",
        FnQuery: "lib/FnQuery",
        "socket.io": "/socket.io/socket.io",
        Modernizr: "lib/modernizr"
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'anim': {
            exports: 'requestAnimationFrame'
        },
        "socket.io": {
            exports: "io"
        },
        'Modernizr': {
            exports: "Modernizr"
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
