define([
	'backbone',
	'underscore',
	'views/main',
	'views/game',
	'views/scoreboard'
], function(
	Backbone,
	underscore,
	mainView,
	gameView,
	scoreboardView
){

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            '*default': 'defaultActions'
        },
        defaultActions: function () {
			mainView.show();
        },
        gameAction: function () {
            gameView.show();
        },
		scoreboardAction: function () {
      		scoreboardView.show();
        }
    });

    return new Router();
});
