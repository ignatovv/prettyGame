define([
    'backbone',
	'gyro'
], function(
    Backbone,
	gyro
){

    var Model = Backbone.Model.extend({	
        playerX: 0,
        playerY: 0,
        bossX: 0,
        bossRight: true,
        start: function () {
			var max_accelerate = 15;
			var max_angle = 35;
			var min_angle = -35;
			var canvasWidth = 320;
			var canvasHeight = 640;
			var rectWidth = 60;
			var rectHeight = 112;
			
			this.playerX = (canvasWidth - rectWidth) / 2;
			this.playerY = canvasHeight - rectHeight - 20;
			
			this.bossX = 50;
			this.bossRight = true;
			
			var game = this;
			
			gyro.frequency = 10;
			gyro.stopTracking();
           	gyro.startTracking(function(o) {
				if (!o.x) {
					gyro.stopTracking();
					return;
				}
	
				var tilt;
				
				if (window.orientation == -90) tilt = (-1) * o.beta;
				else if (window.orientation == 90) tilt = o.beta;
				else if (window.orientation == 0) tilt = o.gamma;
				else if (window.orientation == 180) tilt = (-1) * o.gamma;
				
				if (tilt > max_angle) tilt = max_angle;
				else if (tilt < min_angle) tilt = min_angle;
				
				game.playerX += (tilt / max_angle) * max_accelerate;
				
				if (game.playerX < 0) game.playerX = 0;
				else if (game.playerX > canvasWidth - rectWidth) game.playerX = canvasWidth - rectWidth;
			
				game.bossX = (game.bossRight) ? game.bossX + 1 : game.bossX - 1;
			
        		if (game.bossX > canvasWidth - 111 || game.bossX < 0) game.bossRight = !game.bossRight;
			});
		
            return this;
        }
    });

    return new Model();
});
