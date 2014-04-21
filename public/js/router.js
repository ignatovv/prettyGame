define([
	'backbone',
	'underscore',
	'views/viewManager',
	'views/main',
	'views/game',
	'views/scoreboard',
	'views/notsupported',
	'views/loading'
], function(
	Backbone,
	underscore,
	viewManager,
	mainView,
	gameView,
	scoreboardView,
	notSupportedView,
	loadingView
){

    var Router = Backbone.Router.extend({
    	isChrome: false,
        routes: {
            'scoreboard': 'scoreboardAction',
            'scoreboard?limit=:limit': 'scoreboardAction',
            'game': 'gameAction',
            '*default': 'defaultActions'
        },
		initialize: function () {
			this.isChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());

			viewManager.addView(mainView);
			viewManager.addView(gameView);
			viewManager.addView(scoreboardView);
			viewManager.addView(notSupportedView);
			viewManager.addView(loadingView);
        },
        defaultActions: function () {
			if (!this.isChrome) {
				notSupportedView.show();
				return;
			}

			mainView.show();
        },
        gameAction: function () {
        	if (!this.isChrome) {
				notSupportedView.show();
				return;
			}

            gameView.show();
        },
		scoreboardAction: function (limit) {
			if (!this.isChrome) {
				notSupportedView.show();
				return;
			}

      		scoreboardView.show(limit);
        }
    });

    return new Router();
});
