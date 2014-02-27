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
        show: function () {
            gamelogic.start();
        	$('#page').html(gamecanvas.updateCanvas().el);
        }
    });

    return new View();
});