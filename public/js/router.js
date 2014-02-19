define([
       'backbone',
       'underscore',
       'views_main'
], function(
       Backbone,
       underscore,
       mainView
){

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            '*default': 'defaultActions'
        },
        defaultActions: function () {
               //var mainWindow = new MainView();
               $('body').html(mainView.render().el);
           
            
        },
        scoreboardAction: function () {
           //todo
        },
        gameAction: function () {
            // TODO
        }
    });

    return new Router();
});