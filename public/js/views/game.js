define([
    'backbone',
	'gyro',
    'tmpl/game',
    'models/gamecanvas',
    'models/gamelogic',
    'views/gameover',
    'anim'
], function(
    Backbone,
	gyro,
    tmpl,
    gamecanvas,
    gamelogic,
    gameover,
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
            $(document).on("keydown", this.buttonDown);
            $(document).on("keyup", this.buttonUp);

            this.nextFrame();
			this.$el.show();
			this.trigger('show', this);            
			
            gamelogic.startNewGame();
            this.playMusic();
        },
        hide: function() {
            $(document).off("keydown", this.buttonDown);
            $(document).off("keyup", this.buttonUp);

			gameover.hide();
            this.$el.hide();
			
			gamelogic.stopGyro();
            this.stopMusic();
		},
        playMusic: function() {
            var musicElement = $('.background__music').get(0);

            if (!localStorage['sound'] || localStorage['sound'] == 'on') {
                musicElement.currentTime = 0;
                musicElement.volume = 0.6;
                musicElement.play();
            }
        },
        stopMusic: function() {
            var musicElement = $('.background__music').get(0);

            if (!musicElement.paused) {
                musicElement.pause();
            }
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