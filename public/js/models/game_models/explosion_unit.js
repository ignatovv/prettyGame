define([
    'backbone',
    'models/game_models/game_model',
    'collections/explosions'
], function(
    Backbone,
    GameModel,
    explosions
){
    var ExplosionUnit = GameModel.extend({	
    	x: 0,
    	y: 0,
        width: 200,
        height: 200,
        frames: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    	initialize: function(gamelogic) {
    		ExplosionUnit.__super__.initialize(gamelogic, this);
            this.image = ExplosionUnit.image;
    	},
        timeElapsed: function() {
            if (!this.frames) {
                return;
            }

            ++this.timeSinceNewFrame;

            if (this.timeSinceNewFrame >= this.frames[this.currentFrame]) {
                ++this.currentFrame;
                this.timeSinceNewFrame = 0;
                
                if (this.currentFrame >= this.frames.length) {
                    explosions.remove(this);
                }
            }
        },
        move: function() {            
            this.y = this.y + 5;
            
            if (this.y > this.gamelogic.canvasHeight) {  
                explosions.remove(this);
            } 
        },
    }, 
    {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/explosion1.gif";
        }
    });

    return ExplosionUnit;
});