define([
    'backbone',
    'models/game_models/game_model',
    'collections/effects'
], function(
    Backbone,
    GameModel,
    effects
){
    var ExplosionUnit = GameModel.extend({    
        width: 65,
        height: 65,    
        frames: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        cycle: 0,
        speed: 0,
        initialize: function(gamelogic) {          
            ExplosionUnit.__super__.initialize(gamelogic, this);
            this.image = ExplosionUnit.image;
        },
        move: function() {            
            this.y += this.speed;
        },
        timeElapsed: function() {
            ++this.timeSinceNewFrame;

            if (this.timeSinceNewFrame >= this.frames[this.currentFrame]) {
                ++this.currentFrame;
                this.timeSinceNewFrame = 0;
                
                if (this.currentFrame >= this.frames.length) {
                    effects.remove(this);
                }
            }
        }
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/explosion.gif";
        }
    });

    return ExplosionUnit;
});