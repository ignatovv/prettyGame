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
			$('#page').html(mainView.render().el);
        },
        gameAction: function () {
            $('#page').html(gameView.render().el);
        },
		scoreboardAction: function () {
      		$('#page').html(scoreboardView.render().el);
        }
    });

    return new Router();
});
