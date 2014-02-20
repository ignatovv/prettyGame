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

			var max_accelerate = 15;
			var max_angle = 35;
			var min_angle = -35;
			var canvasWidth = 320;
			var canvasHeight = 640;
			var rectWidth = 10;
			var rectHeight = 10;
			var ctx = $(this.el).find("#canvas").get(0).getContext("2d");
			var debug = $(this.el).find("#debug");
			
			var x = (canvasWidth - rectWidth) / 2;
			var y = 20;
			
			gyro.frequency = 10;
           	gyro.startTracking(function(o) {
				if (o.x == null) {
					gyro.stopTracking();
					return;
				}
	
				debug.html("x=" + o.x.toFixed(1) + " y=" + o.y.toFixed(1) + " z=" + o.z.toFixed(1) + " alpha=" + o.alpha.toFixed(1) + " beta=" + o.beta.toFixed(1) + " gamma=" + o.gamma.toFixed(1) + " orientation=" + window.orientation);
		
				var tilt;
				
				if (window.orientation == -90) tilt = (-1) * o.beta;
				else if (window.orientation == 90) tilt = o.beta;
				else if (window.orientation == 0) tilt = o.gamma;
				else if (window.orientation == 180) tilt = (-1) * o.gamma;
				
				if (tilt > max_angle) tilt = max_angle;
				else if (tilt < min_angle) tilt = min_angle;
				
				x += (tilt / max_angle) * max_accelerate;
				
				if (x < 0) x = 0;
				else if (x > canvasWidth - rectWidth) x = canvasWidth - rectWidth;
				
				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				
				ctx.fillStyle = "#FF0000";
				ctx.fillRect(x, y, rectWidth, rectHeight);
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