define([
    'backbone',
    'models/game_models/game_model',
    'collections/bombs'
], function(
    Backbone,
    GameModel,
    bombs
){
    var BlastUnit = GameModel.extend({    
        width: 50,
        height: 59,    
        frames: [5, 5, 5, 5, 5, 5],
        // speed: 10,
        initialize: function(gamelogic) {          
            BlastUnit.__super__.initialize(gamelogic, this);
            this.image = BlastUnit.image;
        },
        move: function() {            
            this.y = this.y + 10;
            
            if (this.y > this.gamelogic.canvasHeight) {  
                bombs.remove(this);
            }  
        },
        hit: function(power) {   
                   
        },
        contains: function(canvas_x, canvas_y) {
            var x = canvas_x - this.x;
            var y = canvas_y - this.y;
            var r = 20;

            x -= this.width / 2;
            y -= this.height / 2;
            
            return y >= (-1) * Math.sqrt(r * r - x * x) + r && y <= Math.sqrt(r * r - x * x);
        }
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/blast.gif";
        }
    });

    return BlastUnit;
});
