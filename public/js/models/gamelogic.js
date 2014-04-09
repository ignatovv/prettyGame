define([
    'backbone',
	'gyro',
	'models/game_models/boss_unit',
	'models/game_models/player_unit',
	'models/game_models/stone_unit',
	'collections/bombs',
	'collections/stones'
], function(
    Backbone,
	gyro,
	BossUnit,
	PlayerUnit,
	StoneUnit,
	bombs,
	stones
){

    var Logic = Backbone.Model.extend({	
        canvasWidth: 1050,
		canvasHeight: 680,
		playerUnit: null,
		bossUnit: null,
		scores:0,
		max_accelerate: 15,
		max_angle: 35,
		min_angle: -35,
		gamePaused: false,
		bombs: bombs,
		stones: stones,
		timer: 0,
		initialize: function () {
			this.playerUnit = new PlayerUnit(this);
			this.bossUnit = new BossUnit(this);
			this.bossUnit.canvasWidth = this.canvasWidth;
			this.bossUnit.on('bomb_dropped', this.onBombDropped);
			gyro.frequency = 15;			
        },
        startNewGame: function() {
        	this.startGyro();
        	this.gamePaused = false;
        	this.bossUnit.refresh();  
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
			
			this.createStoneIfNeeded();
			this.moveGameModels();
			this.detectCollisions();		

			this.trigger('game_frame');
		},
		moveGameModels: function() {
			this.playerUnit.move();
			this.bossUnit.move();

			bombs.forEach(function(bomb) {
				bomb.move(this.playerUnit.x, this.playerUnit.y);
			}, this);

			stones.forEach(function(stone) {
				stone.move(this.playerUnit.x, this.playerUnit.y);
			}, this);
		},
		createStoneIfNeeded: function() {
			++this.timer;
			
			if (this.timer >= 40) {
				var stoneUnit = new StoneUnit(this);

				stoneUnit.canvasHeight = this.canvasHeight;
				stoneUnit.x = this.playerUnit.x;
				stones.add(stoneUnit);

				this.timer = 0;
			}
		},
		detectCollisions: function() {
			bombs.forEach(function(bomb) {
				if (bomb.exploded) { this.endGame(); }
			}, this);

			stones.forEach(function(stone) {
				if (stone.exploded) { this.endGame(); }
			}, this);
		},
		onBombDropped: function(bombUnit) {
			bombs.add(bombUnit);
		},
		endGame: function() {
			this.gamePaused = true;
			this.trigger('endgame', this);
		}
    });
	
    return new Logic();
});