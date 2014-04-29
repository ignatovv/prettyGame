define([
	'backbone',
	'models/game_models/game_model',
	'models/game_models/explosion_unit',
	'collections/powerups',
	'collections/effects'
], function(
	Backbone,
	GameModel,
	ExplosionUnit,
	powerups,
	effects
){
	var PowerupUnit = GameModel.extend({    
		width: 42,
		height: 41,    
		frames: [5, 5, 5, 5, 5, 5, 5, 5],
		hp: 2,
		speed_x_max: 5,
		speed_y: 3,
		movingRight: true,
		deviation_x: 0,
		deviation_x_max: 125,
		break_path: 50,
		initialize: function(gamelogic) {
			PowerupUnit.__super__.initialize(gamelogic, this);
			this.image = PowerupUnit.image;
		},
		move: function() {            
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
			
			if (this.y > this.gamelogic.canvasHeight) {  
				powerups.remove(this);
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
			powerups.remove(this);
			this.gamelogic.explode(this);
		},
		contains: function(canvas_x, canvas_y) {
			return true;
		}
	}, {
		image: new Image(),
		loadImage: function() {
			this.image.src = "/images/crate.gif";
		}
	});

	return PowerupUnit;
});
