define([
    'backbone',
	'gyro',
    'tmpl/game'
], function(
    Backbone,
	gyro,
    tmpl
){
    var View = Backbone.View.extend({
	
        template: tmpl,
        initialize: function () {
            // TODO
        },
        render: function () {
			$(this.el).html(this.template());

			var x = 0;
			var y = 0;
			var step_length = 1;
			var ctx = $(this.el).find("#canvas").get(0).getContext("2d");
			var debug = $(this.el).find("#debug");
			
			gyro.frequency = 50;
           	gyro.startTracking(function(o) {
				if (o.x == null) {
					gyro.stopTracking();
					return;
				}
	
				debug.html("");
				debug.html("x=" + o.x.toFixed(1) + " y=" + o.y.toFixed(1) + " z=" + o.z.toFixed(1) + " alpha=" + o.alpha.toFixed(1) + " beta=" + o.beta.toFixed(1) + " gamma=" + o.gamma.toFixed(1) + " orientation=" + window.orientation);
				
				var degree_delta = (window.orientation == 0) ? o.alpha : o.beta + 90;
				
				x += step_length * Math.cos(Math.PI * degree_delta / 360);
				y += step_length * Math.sin(Math.PI * degree_delta / 360);
				
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				
				ctx.fillStyle = "#FF0000";
				ctx.fillRect(x, y, 10, 10);
			});
			
            return this;
        },
        show: function () {
            // TODO
        },
        hide: function () {
            // TODO
        }

    });

    return new View();
});