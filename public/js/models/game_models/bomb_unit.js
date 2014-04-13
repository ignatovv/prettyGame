define([
    'backbone',
    'models/game_models/game_model',
    'collections/bombs'
], function(
    Backbone,
    GameModel,
    bombs
){
    var BombUnit = GameModel.extend({    
        width: 50,
        height: 50,
        initialize: function(gamelogic) {          
            BombUnit.__super__.initialize(gamelogic, this);
            this.image = BombUnit.image;
        },
        move: function() {            
            this.y = this.y + 5;
            
            if (this.y > this.gamelogic.canvasHeight) { console.log('bomb');    
                bombs.remove(this);
                this.gamelogic.scores = this.gamelogic.scores + 1;
            }  
        },
        contains: function(canvas_x, canvas_y) {
            var x = canvas_x - this.x;
            var y = canvas_y - this.y;
            var r = 17;

            x -= this.width / 2;
            y -= this.height / 2;
            
            return y >= (-1) * Math.sqrt(r * r - x * x) + r && y <= Math.sqrt(r * r - x * x);
        }
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/bomb.gif";
        }
    });

    return BombUnit;
});
