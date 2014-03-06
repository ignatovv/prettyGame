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

    function nextFrame() {
        setTimeout(function() {
			if (!gamelogic.playing) {
				return;
			}
	
            requestAnimationFrame(nextFrame);
            gamelogic.processGameFrame();
            gamecanvas.updateCanvas();
        }, 1000 / gamecanvas.fps);
    }
    
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
		
        render: function () {
            this.$el.html(this.template());
            $(document).get(0).addEventListener("keydown", this.buttonDown);
            $(document).get(0).addEventListener("keyup", this.buttonUp);
            return this;
        },
        show: function () {
			this.$el.show();
			this.trigger('show', this);
			
            gamelogic.startGyro();
			gamelogic.playing = true;
            nextFrame();
        },
        hide: function() {
			this.$el.hide();
			
			gamelogic.stopGyro();
			gamelogic.playing = false;
		}
    });

    return new View();
});