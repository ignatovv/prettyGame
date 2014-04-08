define([
    'backbone',
	'gyro',
	'models/game_models/boss_unit',
	'models/game_models/player_unit',
	'models/game_models/bomb_unit',
	'models/game_models/stone_unit',
	'collections/bombs',
	'collections/stones'
], function(
    Backbone,
	gyro,
	bossUnit,
	PlayerUnit,
	BombUnit,
	StoneUnit,
	bombs,
	stones
){

    var Logic = Backbone.Model.extend({	
        canvasWidth: 1050,
		canvasHeight: 680,
		bossUnit: bossUnit,
		playerUnit: null,
		scores:0,
		max_accelerate: 15,
		max_angle: 35,
		min_angle: -35,
		gamePaused: false,
		bombs: bombs,
		stones: stones,
		timer: 0,
		initialize: function () {
			bossUnit.canvasWidth = this.canvasWidth;
			this.playerUnit = new PlayerUnit(this);
			gyro.frequency = 15;			
        },
        startNewGame: function() {
        	this.startGyro();
        	this.gamePaused = false;
        	bossUnit.refresh();  
        	this.playerUnit.refresh();
        	this.scores = 1;    
        	this.timer = 0; 
        	bombs.reset();
        	stones.reset();
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
        	this.playerUnit.movingLeft = false;
        	this.playerUnit.movingRight = false;
        },
        moveLeft: function() {
        	this.playerUnit.movingLeft = true;
        },
        moveRight: function() {
        	this.playerUnit.movingRight = true;
        },
		processGameFrame: function() {
			if (this.gamePaused) {
				return;
			}

			this.playerUnit.move();
			bossUnit.move();
			
			if (bossUnit.bombDropped) {
				var bombUnit = new BombUnit();
				bombUnit.canvasHeight = this.canvasHeight;					
				bombUnit.x = bossUnit.x;
				bombUnit.y = bossUnit.y;
				bombs.add(bombUnit);
				bossUnit.bombDropped = false;
			}		

			if (this.timer > 40) {
				this.timer = 0;					
				var stoneUnit = new StoneUnit();
				stoneUnit.canvasHeight = this.canvasHeight;
				stoneUnit.x = this.playerUnit.x;
				stones.add(stoneUnit);
			} else {
				this.timer = this.timer + 1;
			}
			
			var game = this;			
			var bombsToRemove = [];
			var stonesToRemove = [];
			
			bombs.forEach(function(bomb) {
				bomb.move(game.playerUnit.x, game.playerUnit.y);
				if (bomb.exploded) { game.endGame(); }
				if (bomb.deleted) {
					game.scores = game.scores + 1; 
					bombsToRemove.push(bomb);	
				}
			}, this);

			stones.forEach(function(stone) {
				stone.move(game.playerUnit.x, game.playerUnit.y);
				if (stone.exploded) { game.endGame(); }
				if (stone.deleted) {
					game.scores = game.scores + 2; 
					stonesToRemove.push(stone);
				}
			}, this);

			bombs.remove(bombsToRemove);
			stones.remove(stonesToRemove);

			this.trigger('game_frame', this);
		},
		endGame: function() {
			this.gamePaused = true;
			this.trigger('endgame', this);
		}
    });
	
    return new Logic();
});