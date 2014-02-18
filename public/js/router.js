define([
       'backbone'
], function(
){

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            '*default': 'defaultActions'
        },
        defaultActions: function () {
                                        alert('kokok');
        },
        scoreboardAction: function () {
                                        alert("test");
        },
        gameAction: function () {
            // TODO
        }
    });

    return new Router();
});