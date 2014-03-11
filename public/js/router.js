define([
	'backbone',
	'underscore',
	'views/viewManager',
	'views/main',
	'views/game',
    'views/gameOver',
	'views/scoreboard'
], function(
	Backbone,
	underscore,
	viewManager,
	mainView,
	gameView,
    gameOverView,
	scoreboardView
){

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            'gameover': 'gameOverAction',
            '*default': 'defaultActions'
        },
		initialize: function () {
			viewManager.addView(mainView);
			viewManager.addView(gameView);
            viewManager.addView(gameOverView);
			viewManager.addView(scoreboardView);
        },
        defaultActions: function () {
			mainView.show();
        },
        gameAction: function () {
            gameView.show();
        },
        gameOverAction: function () {
            gameOverView.show();
        },
		scoreboardAction: function () {
      		scoreboardView.show();
        }
    });

    return new Router();
});
