define([
    'backbone',
	'gyro',
	'models/game_models/boss_unit',
	'models/game_models/player_unit',
	'models/game_models/bomb_unit',
	'models/game_models/stone_unit',
	'collections/bombs'
], function(
    Backbone,
	gyro,
	bossUnit,
	playerUnit,
	BombUnit,
	stoneUnit,
	bombs
){

    var Logic = Backbone.Model.extend({	
        canvasWidth: 1050,
		canvasHeight: 680,
		bossUnit: bossUnit,
		playerUnit:playerUnit,
		//bombUnit:bombUnit,
		scores:0,
		max_accelerate: 15,
		max_angle: 35,
		min_angle: -35,
		gamePaused: false,
		bombs:bombs,
		initialize: function () {
			bossUnit.canvasWidth = this.canvasWidth;
			playerUnit.canvasWidth = this.canvasWidth;
			playerUnit.canvasHeight = this.canvasHeight;
			//bombUnit.canvasHeight = this.canvasHeight;		
			gyro.frequency = 15;			
        },
        startNewGame: function() {
        	this.startGyro();
        	this.gamePaused = false;
        	bossUnit.refresh();        	
        	//bombUnit.refresh();
        	stoneUnit.refresh();
        	playerUnit.refresh();
        	this.scores = 0;     
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
        	playerUnit.movingLeft = true;
        },
        moveRight: function() {
        	playerUnit.movingRight = true;
        },
		processGameFrame: function() {
			if(!this.gamePaused) {

				bossUnit.move(playerUnit.x);
				if(bossUnit.bombDropped){
					var bombUnit = new BombUnit();
					bombUnit.canvasHeight = this.canvasHeight;					
					bombUnit.x = bossUnit.x;
					bombUnit.y = bossUnit.y;
					bombs.add(bombUnit);
				bossUnit.bombDropped = false;
				}			
				
				playerUnit.move();
				
				var game = this;			
				bombs.forEach(function(bomb) {
					bomb.move(game.playerUnit.x, game.playerUnit.y);
					if(bomb.exploded) { game.endGame(); }
					if(bomb.deleted) { game.scores = game.scores + 1; 
					///delete bomb					
					}
				}, this);
			}
		},
		endGame: function() {
			this.gamePaused = true;
			this.trigger('endgame', this);
		}
    });
	
    return new Logic();
});