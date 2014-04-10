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
        movingRight: false,
        movingLeft: false,
    	initialize: function(gamelogic) {
            PlayerUnit.__super__.initialize(gamelogic, this);
            this.image = PlayerUnit.image;
    	},
		move: function() {		
			if (this.movingLeft) this.x = this.x - 3;
            if (this.movingRight) this.x = this.x + 3;
			if (this.x > this.gamelogic.canvasWidth - 61)  this.x = this.gamelogic.canvasWidth - 61;
            else if (this.x < 0) this.x = 0;
            
            if (this.hp == 0) {
               //this.image.src = "/images/bomb.gif";
            }
		}
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/spaceship.gif";
        }
    });

    return PlayerUnit;
});
