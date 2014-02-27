define([
    'backbone',
	'gyro',
    'tmpl/game',
    'models/gamecanvas',
    'models/gamelogic'
], function(
    Backbone,
	gyro,
    tmpl,
    gamecanvas,
    gamelogic
){

    var View = Backbone.View.extend({	
        template: tmpl,
        render: function () {
            $(this.el).html(this.template());
            return this;
        },
        show: function () {
            $('#page').html(this.render().el);

            gamelogic.start();
        	gamecanvas.updateCanvas();
        }
    });

    return new View();
});