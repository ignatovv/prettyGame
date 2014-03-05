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
        render: function () {
            $(this.el).html(this.template());
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