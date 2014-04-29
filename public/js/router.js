define([
	'backbone',
	'underscore',
	'Modernizr',
	'views/viewManager',
	'views/main',
	'views/game',
	'views/scoreboard',
	'views/notsupported',
	'views/loading'
], function(
	Backbone,
	underscore,
	Modernizr,
	viewManager,
	mainView,
	gameView,
	scoreboardView,
	notSupportedView,
	loadingView
){

    var Router = Backbone.Router.extend({
    	isCapable: false,
        routes: {
            'scoreboard': 'scoreboardAction',
            'scoreboard?limit=:limit': 'scoreboardAction',
            'game': 'gameAction',
            '*default': 'defaultActions'
        },
		initialize: function () {
			var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);

			if (isMobile) {
				window.location = '/joystick';
				return;
			}

			this.isCapable = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()) && Modernizr.canvas && Modernizr.websockets;

			viewManager.addView(mainView);
			viewManager.addView(gameView);
			viewManager.addView(scoreboardView);
			viewManager.addView(notSupportedView);
			viewManager.addView(loadingView);
        },
        defaultActions: function () {
			if (!this.isCapable) {
				notSupportedView.show();
				return;
			}

			mainView.show();
        },
        gameAction: function () {
        	if (!this.isCapable) {
				notSupportedView.show();
				return;
			}

            gameView.show();
        },
		scoreboardAction: function (limit) {
			if (!this.isCapable) {
				notSupportedView.show();
				return;
			}

      		scoreboardView.show(limit);
        }
    });

    return new Router();
});
