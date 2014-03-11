define([
    'backbone',
	'gyro',
	'models/game_models/boss_unit',
	'models/game_models/player_unit',
	'models/game_models/bomb_unit',
], function(
    Backbone,
	gyro,
	bossUnit,
	playerUnit,
	bombUnit

){

    var Logic = Backbone.Model.extend({	
        canvasWidth: 1050,
		canvasHeight: 680,
		bossUnit: bossUnit,
		playerUnit:playerUnit,
		bombUnit:bombUnit,
		max_accelerate: 15,
		max_angle: 35,
		min_angle: -35,
		initialize: function () {
			bossUnit.canvasWidth = this.canvasWidth;
			playerUnit.canvasWidth = this.canvasWidth;
			playerUnit.canvasHeight = this.canvasHeight;
			gyro.frequency = 15;
        },
        startGyro: function () {
        	var game = this;

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

				if (tilt > game.max_angle) tilt = game.max_angle;
				else if (tilt < game.min_angle) tilt = game.min_angle;

				game.playerX += (tilt / game.max_angle) * game.max_accelerate;

				if (game.playerX < 0) game.playerX = 0;
				else if (game.playerX > game.canvasWidth - game.rectWidth) game.playerX = game.canvasWidth - game.rectWidth;
			});
        },
		stopGyro: function () {
			gyro.stopTracking();
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
			flag = false;
			if (-playerUnit.y + bombUnit.y > 40) {
					bossUnit.bombDropped = false;
				};
			if(bossUnit.bombDropped) {
				bombUnit.move();
				if(bombUnit.x > playerUnit.x){
					if(( bombUnit.x - playerUnit.x) < 40 && (playerUnit.y - bombUnit.y) < 40){
					// playerUnit.hp = 0;
					alert("lose left");   		
					}	
				} else if(( playerUnit.x - bombUnit.x) < 40 && (playerUnit.y - bombUnit.y) < 40){
					// playerUnit.hp = 0;
					alert("lose right");
				} 
			} else {
				bossUnit.dropBomb(playerUnit.x);
				bombUnit.x = bossUnit.x;
				bombUnit.y = bossUnit.y;
			}	
		}     
    });
	
    return new Logic();
});
