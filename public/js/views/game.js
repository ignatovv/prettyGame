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
			var rectWidth = 60;
			var rectHeight = 112;
			var ctx = $(this.el).find("#canvas").get(0).getContext("2d");
			var debug = $(this.el).find("#debug");
			
			var x = (canvasWidth - rectWidth) / 2;
			var y = canvasHeight - rectHeight - 20;
			
			var spaceshipImage = new Image();
			var backgroundImage = new Image();
			var bossImage = new Image();
			var stoneImage = new Image();
			
			spaceshipImage.src = "/images/spaceship.gif";
			backgroundImage.src = "/images/background.jpg";
			bossImage.src = "/images/boss.png";
			stoneImage.src = "/images/stone.gif";
			
			var bossX = 50;
			var bossRight = true;
			
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
				
				//ctx.fillStyle = "#FF0000";
				//ctx.fillRect(x, y, rectWidth, rectHeight);
				
				ctx.drawImage(backgroundImage, 0, 0);
				ctx.drawImage(spaceshipImage, x, y);
				ctx.drawImage(bossImage, bossX, 20);
				ctx.drawImage(stoneImage, 50, 200);
				
				bossX = (bossRight) ? bossX + 1 : bossX - 1;
				
				if (bossX > canvasWidth - 111 || bossX < 0) bossRight = !bossRight;
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
