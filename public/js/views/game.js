define([
    'backbone',
    'tmpl/game',
    'models/gamecanvas',
    'models/gamelogic',
    'views/gameover',
    'views/loading',
    'anim',
], function(
    Backbone,
    tmpl,
    gamecanvas,
    gamelogic,
    gameover,
    loadingView,
    anim
){
    var View = Backbone.View.extend({	
        template: tmpl,
        className: 'full_screen_view_container',
		initialize: function () {
			this.$el.hide();
            gamelogic.on('endgame', this.onEndGame, this);
        },
		nextFrame: function() {
			var game = this;
			
	        nextFrameTimeout = setTimeout(function() {
				if (!game.$el.is(":visible")) {
					return;
				}
                
	            requestAnimationFrame(function() { game.nextFrame(); });
	            gamelogic.processGameFrame();
	            gamecanvas.updateCanvas();
	        }, 1000 / gamecanvas.fps);
	    },
        render: function () {
            this.$el.html(this.template());
            this.$el.find('.game__overlay_container').html(gameover.render().$el);
            return this;
        },
        show: function () {
            if (loadingView.loading(this)) {
                return;
            }

            $(document).on("keydown", this.buttonDown);
            $(document).on("keyup", this.buttonUp);

            this.nextFrame();
			this.$el.show();
			this.trigger('show', this);
			
            gamelogic.startNewGame();
        },
        hide: function() {
            $(document).off("keydown", this.buttonDown);
            $(document).off("keyup", this.buttonUp);

			gameover.hide();
            this.$el.hide();
			
            gamelogic.soundFactory.stopBackgroundMusic();
		},
        buttonDown: function(e) {
            if (e.keyCode == 37 || e.keyCode == 65) {
                gamelogic.leftButtonPressed = true;
            } else if (e.keyCode == 39|| e.keyCode == 68) {
                gamelogic.rightButtonPressed = true;           
            } else if (e.keyCode == 32) {
                gamelogic.spacebarButtonPressed = true;
            }
        },
        buttonUp: function(e) {
            if (e.keyCode == 37 || e.keyCode == 65) {
                gamelogic.leftButtonPressed = false;
            } else if (e.keyCode == 39 || e.keyCode == 68) {
                gamelogic.rightButtonPressed = false;
            } else if (e.keyCode == 32) {
                gamelogic.spacebarButtonPressed = false;
            } 
        },
        onEndGame: function() {
            gameover.show();
        }
    });

    return new View();
});