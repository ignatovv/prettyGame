define([
    'backbone',
	'gyro',
	'models/game_models/boss_unit',
	'models/game_models/player_unit',
	'models/game_models/stone_unit',
	'models/game_models/slug_unit',
	'models/game_models/explosion_unit',
	'collections/bombs',
	'collections/stones',
	'collections/slugs',
	'collections/explosions',
], function(
    Backbone,
	gyro,
	BossUnit,
	PlayerUnit,
	StoneUnit,
	SlugUnit,
	ExplosionUnit,
	bombs,
	stones,
	slugs,
	explosions
){
    var GameLogic = Backbone.Model.extend({	
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
		slugs: slugs,
		explosions: explosions,
		timer: 0,
		leftButtonPressed: false,
		rightButtonPressed: false,
		spacebarButtonPressed: false,
		initialize: function () {
			gyro.frequency = 15;			
        },
        startNewGame: function() {
        	this.startGyro();
        	this.gamePaused = false;
        	this.playerUnit = new PlayerUnit(this);
        	this.playerUnit.on('player_shot', this.onPlayerShot);
			this.bossUnit = new BossUnit(this);
			this.bossUnit.on('bomb_dropped', this.onBombDropped);
        	this.scores = 1;    
        	this.timer = 0; 
        	bombs.reset();
        	stones.reset();
        	slugs.reset();
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

			explosions.forEach(function(explosion) {
				explosion.move();
			}, this);

			bombs.forEach(function(bomb) {
				bomb.move();
			}, this);

			stones.forEach(function(stone) {
				stone.move();
			}, this);

			slugs.forEach(function(slug) {
				slug.move();
			}, this);
			
		},
		createStoneIfNeeded: function() {
			++this.timer;
			
			if (this.timer >= 40) {
				var stoneUnit = new StoneUnit(this);

				stoneUnit.x = this.random(0, this.canvasWidth - stoneUnit.width);
				stones.add(stoneUnit);

				this.timer = 0;
			}
		},
		random: function(min, max) {
			return Math.random() * (max - min) + min;
		},
		detectCollisions: function() {
			// bombs.forEach(function(bomb) {
			// 	if (bomb.exploded) { this.endGame(); }
			// }, this);

			// stones.forEach(function(stone) {
			// 	if (stone.exploded) { this.endGame(); }
			// }, this);

			
			bombs.forEach(function(bomb) {
				if (this.intersects(bomb, this.playerUnit)) {
					this.endGame();
				}

				slugs.forEach(function(slug) {
					if(this.intersects(slug, bomb)) {
						this.scores = this.scores + 2;
						bombs.remove(bomb);
						slugs.remove(slug);
						var expl = new ExplosionUnit(this);
						expl.x = bomb.x - 50;
						expl.y = bomb.y - 50 ;
						explosions.add(expl);
					}
				}, this);

			}, this);

			stones.forEach(function(stone) {
				if (this.intersects(stone, this.playerUnit)) {
					this.endGame();
				}

				slugs.forEach(function(slug) {
					if(this.intersects(slug,stone)) {					
						this.scores = this.scores + 2;
						stones.remove(stone)
						slugs.remove(slug);
						slugs.remove(slug);
						var expl = new ExplosionUnit(this);
						expl.x = stone.x - 50;
						expl.y = stone.y - 50 ;
						explosions.add(expl);
					}
				}, this);

			}, this);

			// slugs.forEach(function(slug) {
			// 	if(this.intersects(slug,this.bossUnit)) {
			// 		this.endGame();
			// 	}
			// }, this);

		},
		intersection: function(unit1, unit2) {
			var smaller, bigger;

			if (unit1.coordinate >= unit2.coordinate) {
				bigger = unit1;
				smaller = unit2;
			} else {
				bigger = unit2;
				smaller = unit1;
			}

			var delta = bigger.coordinate - smaller.coordinate;
			var intersect_coordinate, intersect_size;

			if (delta < smaller.size) {
				intersect_coordinate = bigger.coordinate;
				intersect_size = smaller.size - delta;
			}

			return { coordinate: intersect_coordinate, size: intersect_size };
		},
		intersects: function(unit1, unit2) {
			var intersect_x = this.intersection({ coordinate: unit1.x, size: unit1.width }, { coordinate: unit2.x, size: unit2.width });
			var intersect_y = this.intersection({ coordinate: unit1.y, size: unit1.height }, { coordinate: unit2.y, size: unit2.height });

			if (intersect_x.coordinate && intersect_y.coordinate) {
				for (var x = intersect_x.coordinate; x < intersect_x.coordinate + intersect_x.size; ++x) {
					for (var y = intersect_y.coordinate; y < intersect_y.coordinate + intersect_y.size; ++y) {
						if (unit1.contains(x, y) && unit2.contains(x, y)) {
							return true;
						}
					}
				}
			}

			return false;
		},
		onPlayerShot: function(slugUnit) {
			slugs.add(slugUnit);
		},		
		onBombDropped: function(bombUnit) {
			bombs.add(bombUnit);
		},
		endGame: function() {
			this.gamePaused = true;
			this.trigger('endgame', this);
		}
    });
	
    return new GameLogic();
});