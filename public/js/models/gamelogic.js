define([
    'backbone',
	'gyro',
	'models/game_models/boss_unit',
	'models/game_models/player_unit'
], function(
    Backbone,
	gyro,
	bossUnit,
	playerUnit
){

    var Logic = Backbone.Model.extend({	
        canvasWidth: 1050,
		canvasHeight: 680,
		bossUnit: bossUnit,
		playerUnit:playerUnit,

		flag1:false,
		flag2:false,
        start: function () {
        	var max_accelerate = 15;
			var max_angle = 35;
			var min_angle = -35;
			var game = this;
			bossUnit.canvasWidth = this.canvasWidth;
			playerUnit.canvasWidth = this.canvasWidth;
			playerUnit.canvasHeight = this.canvasHeight;

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
        	playerUnit.movingLeft = false;
        	playerUnit.movingRight = false;
        },
        moveLeft: function() {
        	//this.playerX = this.playerX - 3;
        	playerUnit.movingLeft = true;
        },
        moveRight: function() {
        	//this.playerX = this.playerX + 3;	
        	playerUnit.movingRight = true;
        },
		processGameFrame: function() {
			bossUnit.move();
			playerUnit.move();
		}     
    });
	
    return new Logic();
});
