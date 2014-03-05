define([
    'backbone',
	'gyro',
	'models/game_models/boss_unit'
], function(
    Backbone,
	gyro,
	bossunit
){

    var Logic = Backbone.Model.extend({	
        playerX: 0,
        playerY: 0,
        canvasWidth: 1050,
		canvasHeight: 680,
		rectWidth: 60,
		rectHeight: 112,
		bossunit: bossunit,
		flag1:false,
		flag2:false,
        start: function () {
        	var max_accelerate = 15;
			var max_angle = 35;
			var min_angle = -35;
			this.playerX = (this.canvasWidth - this.rectWidth) / 2;
			this.playerY = this.canvasHeight - this.rectHeight - 20;
			var game = this;
			bossunit.canvasWidth = this.canvasWidth;

			gyro.frequency = 15;
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
				else if (game.playerX > game.canvasWidth - game.rectWidth) game.playerX = game.canvasWidth - game.rectWidth;

				});

            return this;
        },
        stop: function() {
        	this.flag1 = false;
        	this.flag2 = false;
        },
        moveLeft: function() {
        	//this.playerX = this.playerX - 3;
        	this.flag1 = true;
        },
        moveRight: function() {
        	//this.playerX = this.playerX + 3;	
        	this.flag2 = true;
        },
		processGameFrame: function() {
			bossunit.move();
			if(this.flag1) this.playerX = this.playerX - 3;
			if(this.flag2) this.playerX = this.playerX + 3;
		}     
    });
	
    return new Logic();
});
