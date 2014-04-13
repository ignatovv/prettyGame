define([
    'backbone',
    'models/game_models/game_model',
    'models/game_models/slug_unit'
], function(
    Backbone,
    GameModel,
    SlugUnit
){
    var PlayerUnit = GameModel.extend({
        x: 500,
        y: 520,
        width: 60,
        height: 112,
        frames: [4, 4, 4, 4],
        hp: 1,
        timeSinceLastShoot: 0,
    	initialize: function(gamelogic) {
            PlayerUnit.__super__.initialize(gamelogic, this);
            this.image = PlayerUnit.image;
    	},
		move: function() {		
			if (this.gamelogic.leftButtonPressed) {
                this.x -= 5;
            }
            
            if (this.gamelogic.rightButtonPressed) {
                this.x += 5;
            }
			
            if (this.x + this.width > this.gamelogic.canvasWidth - 1) {
                this.x = this.gamelogic.canvasWidth - this.width - 1;
            } else if (this.x < 0) {
                this.x = 0;
            }
            
            if (this.hp == 0) {
               //this.image.src = "/images/bomb.gif";
            }
            this.shoot();
		},
        shoot: function() {
            ++this.timeSinceLastShoot;

            if (this.gamelogic.spacebarButtonPressed && this.timeSinceLastShoot >= 10) {
                var slugUnit = new SlugUnit(this.gamelogic);

                slugUnit.x = this.x + this.width / 2 - slugUnit.width / 2;
                slugUnit.y = this.y;                
          
                this.trigger('player_shot', slugUnit);

                this.timeSinceLastShoot = 0;
            }
        },
        contains: function(canvas_x, canvas_y) {
            var x = canvas_x - this.x - 2;
            var y = canvas_y - this.y - 2;
            var width = this.width - 2 * 2;
            var height = 66;
            
            return y >= height * (1 - 2 * x / width) && y >= height * (2 * x / width - 1) && y <= 2 + height;
        }
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/spaceship.gif";
        }
    });

    return PlayerUnit;
});
