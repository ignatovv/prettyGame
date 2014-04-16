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
		speed_x: 5,
		speed_y: 3,
		movingRight: true,
		deviation_x: 0,
		initialize: function(gamelogic) {
			PowerupUnit.__super__.initialize(gamelogic, this);
			this.image = PowerupUnit.image;
		},
		move: function() {            
			this.y += this.speed_y;
			
			if(this.movingRight) {
				this.x = this.x + this.speed_x;
				++this.deviation_x;
			}
			else {
				 this.x = this.x - this.speed_x;            
				 --this.deviation_x;
			}
			if (this.x > this.gamelogic.canvasWidth - this.width || this.x < 0 || Math.abs(this.deviation_x) > 20) {
				this.movingRight = !this.movingRight;
			}

			
			if (this.y > this.gamelogic.canvasHeight) {  
				powerups.remove(this);
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
