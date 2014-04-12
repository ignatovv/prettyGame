define([
    'backbone',
    'models/game_models/game_model'
], function(
    Backbone,
    GameModel
){
    var PlayerUnit = GameModel.extend({
        x: 500,
        y: 520,
        width: 60,
        height: 112,
        frames: [6, 6, 6, 6],
        hp: 1,
    	initialize: function(gamelogic) {
            PlayerUnit.__super__.initialize(gamelogic, this);
            this.image = PlayerUnit.image;
    	},
		move: function() {		
			if (this.gamelogic.leftButtonPressed) {
                this.x -= 3;
            }
            
            if (this.gamelogic.rightButtonPressed) {
                this.x += 3;
            }
			
            if (this.x + this.width > this.gamelogic.canvasWidth - 1) {
                this.x = this.gamelogic.canvasWidth - this.width - 1;
            } else if (this.x < 0) {
                this.x = 0;
            }
            
            if (this.hp == 0) {
               //this.image.src = "/images/bomb.gif";
            }
		},
        contains: function(canvas_x, canvas_y) {
            var x = canvas_x - this.x - 2;
            var y = canvas_y - this.y - 2;
            var width = this.width - 2 * 2;
            var height = 66;
            
            return y > height * (1 - 2 * x / width) && y > height * (2 * x / width - 1) && y < 2 + height;
        }
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/spaceship.gif";
        }
    });

    return PlayerUnit;
});
