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

    function draw() {
        setTimeout(function() {
            requestAnimationFrame(draw);
            gamelogic.processGameFrame();
            gamecanvas.updateCanvas();
        }, 1000 / gamecanvas.fps);
    }
    
    var View = Backbone.View.extend({	
        template: tmpl,

        buttonDown: function(e){
            if(e.keyCode == 37|| e.keyCode == 65) {
                gamelogic.moveLeft();
            } else if(e.keyCode == 39|| e.keyCode == 68) {
                gamelogic.moveRight();
            } 
        },
        buttonUp: function(e){
            if(e.keyCode == 37) {
                gamelogic.stop();
            } else if(e.keyCode == 39) {
                gamelogic.stop();
            } 
        },

        render: function () {
            $(this.el).html(this.template());
            $(document).get(0).addEventListener("keydown", this.buttonDown);
            $(document).get(0).addEventListener("keyup", this.buttonUp);
            return this;
        },
        show: function () {
            $('#page').html(this.render().el);
            gamelogic.start();
            draw();
        },
        hide: function() {
        }
    });

    return new View();
});