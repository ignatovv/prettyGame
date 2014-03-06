define([
    'backbone',
	'gyro',
    'tmpl/game',
    'models/gamecanvas',
    'models/gamelogic',
    'anim'
], function(
    Backbone,
	gyro,
    tmpl,
    gamecanvas,
    gamelogic,
    anim
){

    var View = Backbone.View.extend({	
        template: tmpl,
		initialize: function () {
			this.$el.hide();
			$('#page').append(this.render().el);
        },
        buttonDown: function(e){
            if(e.keyCode == 37 || e.keyCode == 65) {
                gamelogic.moveLeft();
            } else if(e.keyCode == 39|| e.keyCode == 68) {
                gamelogic.moveRight();
            } 
        },
        buttonUp: function(e){
            if(e.keyCode == 37 || e.keyCode == 65) {
                gamelogic.stop();
            } else if(e.keyCode == 39 || e.keyCode == 68) {
                gamelogic.stop();
            } 
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
            $(document).get(0).addEventListener("keydown", this.buttonDown);
            $(document).get(0).addEventListener("keyup", this.buttonUp);
            return this;
        },
        show: function () {
			this.$el.show();
			this.trigger('show', this);
			this.nextFrame();
			
            gamelogic.startGyro();
        },
        hide: function() {
			this.$el.hide();
			
			gamelogic.stopGyro();
		}
    });

    return new View();
});