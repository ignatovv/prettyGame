
define([
	'backbone',
	'models/game_models/game_model',
	'models/game_models/explosion_unit',
	'models/game_models/slug_unit',
	'collections/enemies',
	'collections/effects'
], function(
	Backbone,
	GameModel,
	ExplosionUnit,
	SlugUnit,
	enemies,
	effects
){
	var EnemyUnit = GameModel.extend({    
		width: 64,
		height: 64,    
		frames: [5, 5, 5, 5],
		hp: 4,
		speed_x_max: 5,
		speed_y: 0.5,
		movingRight: true,
		deviation_x: 0,
		deviation_x_max: 125,
		break_path: 50,
		power: 3,
		timeSinceLastShot: 0,
		initialize: function(gamelogic) {
			EnemyUnit.__super__.initialize(gamelogic, this);
			this.image = EnemyUnit.image;
			this.y = - this.height;
		},
		move: function() {          
			++this.timeSinceLastShot;
			if(this.y < this.gamelogic.canvasHeight * 2 / 3) {
				this.y += this.speed_y;
				
				var speed_x = this.speed_x();

				if (this.movingRight) {
					this.x += speed_x;
					this.deviation_x += speed_x;
				} else {
					this.x -= speed_x;            
					this.deviation_x -= speed_x;
				}

				if (this.x > this.gamelogic.canvasWidth - this.width || this.x < 0 || this.deviation_x_max - Math.abs(this.deviation_x) <= 1) {
					this.movingRight = !this.movingRight;
				}
			}
			else {
				this.y += 3 * this.speed_y;
			}
			
			if (this.y > this.gamelogic.canvasHeight) {  
				enemies.remove(this);
			}
			this.shootIfNeeded();
		},
		shootIfNeeded: function() {
			if (this.timeSinceLastShot % 40 == 0) {
					var slugUnit = new SlugUnit(this.gamelogic);
                    slugUnit.x = this.x + (this.width - slugUnit.width) / 2;
                    slugUnit.y = this.y + this.height; 
                    slugUnit.upward = false;               
                    // slugUnit.speed_x = 5;

                    this.gamelogic.soundFactory.playPlayerShoot();
                   	this.gamelogic.addEnemySlug(slugUnit);
			} 
		},
		speed_x: function() {
			var path_left_to_reverse = this.deviation_x_max - Math.abs(this.deviation_x);

			if (path_left_to_reverse <= this.break_path) {
				return Math.ceil(this.speed_x_max * path_left_to_reverse / this.break_path);
			} else {
				return this.speed_x_max;
			}
		},
		hit: function(power) {
			this.hp = this.hp - power;

			if (this.hp <= 0) {
				this.explode();
			}
		},
		explode: function() {
			this.gamelogic.soundFactory.playExplosion2();
			enemies.remove(this);
			this.gamelogic.explode(this);
			this.gamelogic.scores += 4;
		},
		contains: function(canvas_x, canvas_y) {
			return true;
		}
	}, {
		image: new Image(),
		loadImage: function() {
			this.image.src = "/images/enemy_spaceship.gif";
		}
	});

	return EnemyUnit;
});
