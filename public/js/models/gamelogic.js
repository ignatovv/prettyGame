define([
	'backbone',
	'models/game_models/boss_unit',
	'models/game_models/player_unit',
	'models/game_models/stone_unit',
	'models/game_models/slug_unit',
	'models/game_models/powerup_unit',
	'models/game_models/explosion_unit',
	'models/game_models/enemy_unit',
	'models/soundfactory',
	'collections/bombs',
	'collections/stones',
	'collections/slugs',
	'collections/effects',
	'collections/powerups',
	'collections/enemies',
	'collections/enemy_slugs',
	'models/gameserver'
], function(
	Backbone,
	BossUnit,
	PlayerUnit,
	StoneUnit,
	SlugUnit,
	PowerupUnit,
	ExplosionUnit,
	EnemyUnit,
	SoundFactory,
	bombs,
	stones,
	slugs,
	effects,
	powerups,
	enemies,
	enemySlugs,
	GameServer
){
	var GameLogic = Backbone.Model.extend({	
		canvasWidth: 1050,
		canvasHeight: 680,
		playerUnit: null,
		bossUnit: null,
		scores:0,
		gamePaused: false,
		gameOver: false,
		tactsAfterGameOver: 0,
		bombs: bombs,
		stones: stones,
		slugs: slugs,
		powerups: powerups,
		enemies: enemies,
		enemySlugs: enemySlugs,	
		timer: 0,
		leftButtonPressed: false,
		rightButtonPressed: false,
		spacebarButtonPressed: false,
		tilt: 0,
		autoFire: true,
		soundFactory: new SoundFactory(),
		initialize: function () {
			this.gameServer = new GameServer(this);
		},
		startNewGame: function() {
			this.gamePaused = false;
			this.gameOver = false;
			this.playerUnit = new PlayerUnit(this);
			this.playerUnit.on('player_shot', this.onPlayerShot);
			this.bossUnit = new BossUnit(this);
			this.bossUnit.on('bomb_dropped', this.onBombDropped);
			this.scores = 1;
			this.timer = 0;
			this.soundFactory.playBackgroundMusic();
			this.bossUnleashed = false;
			bombs.reset();
			stones.reset();
			slugs.reset();
			powerups.reset();
			effects.reset();
			enemies.reset();
			enemySlugs.reset();
		},
		processGameFrame: function() {
			if (this.gamePaused) {
				return;
			}
			if (this.gameOver) {
				if (this.tactsAfterGameOver > 0)
					this.tactsAfterGameOver--;
				else
					this.endGame();
			}
			++this.timer; 
			this.processTimeEvents();			
			this.moveGameModels();
			this.detectCollisions();

			this.trigger('game_frame');
		},
		moveGameModels: function() {
			if (this.playerUnit.hp > 0) 
				this.playerUnit.move();
			if (this.bossUnleashed)
				this.bossUnit.move();

			bombs.forEach(function(bomb) {
				bomb.move();
			}, this);			

			stones.forEach(function(stone) {
				stone.move();
			}, this);

			slugs.forEach(function(slug) {
				slug.move();
			}, this);

			powerups.forEach(function(powerup) {
				powerup.move();
			}, this);

			effects.forEach(function(effect) {
				effect.move();
			}, this);

			enemies.forEach(function(enemy) {
				enemy.move();
			}, this);

			enemySlugs.forEach(function(slug) {
				slug.move();
			}, this);
		},
		processTimeEvents: function() {						
			if (this.timer % 40  == 0) {
				var stoneUnit = new StoneUnit(this);

				stoneUnit.x = this.random(0, this.canvasWidth - stoneUnit.width);
				stones.add(stoneUnit);			
			}
			if (this.timer % 20  == 0 && !this.bossUnleashed) {
				var stoneUnit = new StoneUnit(this);

				stoneUnit.x = this.random(0, this.canvasWidth - stoneUnit.width);
				stones.add(stoneUnit);			
			}
			if (this.timer % 800 == 0 ) {
				var powerup = new PowerupUnit(this);	
				powerup.x = this.random(powerup.deviation_x_max, this.canvasWidth - powerup.width - powerup.deviation_x_max);
				powerups.add(powerup);		
			}
			if (this.timer  % 200 == 0 ) {
				var enemy = new EnemyUnit(this);	
				// enemy.x = this.random(enemy.deviation_x_max, this.canvasWidth - enemy.width - enemy.deviation_x_max);
				enemy.x = this.playerUnit.x;
				enemy.deviation_x = this.random(0,enemy.deviation_x_max);
				enemies.add(enemy);		
			}

			if (this.scores > 50  && !this.bossUnleashed) {	
				this.bossUnleashed = true;			
				this.bossUnit.unleash();				
				this.soundFactory.stopBackgroundMusic();
				this.soundFactory.playBossMusic();
			}

			if(this.bossUnit.busted && this.timer % 3 == 0) {
				var explosionUnit = new ExplosionUnit(this);
				explosionUnit.x = this.bossUnit.x + ( this.random(-this.bossUnit.width , this.bossUnit.width) + this.bossUnit.width - explosionUnit.width) / 2;
				explosionUnit.y = this.bossUnit.y + this.random(0, this.bossUnit.height * 2 ) + (this.bossUnit.height - explosionUnit.height) / 2;			
				effects.add(explosionUnit);
			}
		},
		random: function(min, max) {
			return Math.random() * (max - min) + min;
		},
		detectCollisions: function() {
			bombs.forEach(function(bomb) {
				if ((this.playerUnit.hp > 0) && (this.intersects(bomb, this.playerUnit))) {
					this.playerUnit.hit(bomb.power);
					bomb.explode();
				}

				slugs.forEach(function(slug) {
					if (this.intersects(slug, bomb)) {
						this.scores = this.scores + 2;
						bomb.hit(slug.power);
						slugs.remove(slug);
					}
				}, this);
			}, this);

			stones.forEach(function(stone) {
				if ((this.playerUnit.hp > 0) && (this.intersects(stone, this.playerUnit))) {
					this.playerUnit.hit(stone.power);
					stone.explode();
				}

				slugs.forEach(function(slug) {
					if(this.intersects(slug,stone)) {	
						stone.hit(slug.power);
						slugs.remove(slug);
						return;
					}
				}, this);				
			}, this);		

			enemies.forEach(function(enemy) {
				if ((this.playerUnit.hp > 0) && (this.intersects(enemy, this.playerUnit))) {
					this.playerUnit.hit(enemy.power);
					enemy.explode();
				}

				slugs.forEach(function(slug) {
					if(this.intersects(slug,enemy)) {	
						enemy.hit(slug.power);
						slugs.remove(slug);
						return;
					}
				}, this);				
			}, this);				

			slugs.forEach(function(slug) {
				if (this.bossUnleashed && !this.bossUnit.busted)
					if(this.intersects(slug,this.bossUnit)) {
						this.bossUnit.hit(slug.power);
						slugs.remove(slug);
					}

				powerups.forEach(function(powerup) {
					if(this.intersects(powerup,slug)) {
						slugs.remove(slug);
						powerup.hit(slug.power);
					}
				},this);

			}, this);

			powerups.forEach(function(powerup) {
				if ((this.playerUnit.hp > 0) && (this.intersects(powerup, this.playerUnit))) {
					powerups.remove(powerup);
					this.playerUnit.getPowerup();
				}
			},this);

			enemySlugs.forEach(function(slug) {
				if ((this.playerUnit.hp > 0) && (this.intersects(slug, this.playerUnit))) {
					enemySlugs.remove(slug);
					this.playerUnit.hit(slug.power);
				}
			}, this);

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
		addEnemySlug: function(slug) {
			enemySlugs.add(slug);
		},
		explode: function(unit) {
			var explosionUnit = new ExplosionUnit(this);

			explosionUnit.x = unit.x + (unit.width - explosionUnit.width) / 2;
			explosionUnit.y = unit.y + (unit.height - explosionUnit.height) / 2;
			if (unit.speed == null) 
				explosionUnit.speed = unit.speed_y;
			else
				explosionUnit.speed = unit.speed;

			effects.add(explosionUnit);
		},
		endGame: function() {
			this.gamePaused = true;
			this.soundFactory.stopBackgroundMusic();
			this.trigger('endgame', this);
		}
	});
	return new GameLogic();
});