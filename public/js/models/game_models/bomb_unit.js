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
        exploded: false,
        initialize: function(gamelogic) {          
            BombUnit.__super__.initialize(gamelogic, this);
            this.image = BombUnit.image;
        },
        move: function(playerX, playerY) {            
            this.y = this.y + 5;
            if(this.y < playerY){
                if(this.x > playerX){
                    if(( this.x - playerX) < 40 && (playerY - this.y) < 40){
                    // playerUnit.hp = 0;
                    this.exploded = true;
                    }   
                } else if((playerX - this.x) < 40 && (playerY - this.y) < 40){
                    // playerUnit.hp = 0;
                    this.exploded = true;
                } 
            }
            if (this.y > this.canvasHeight) {               
                bombs.remove(this);
                this.gamelogic.scores = this.gamelogic.scores + 1;
            }  
        }   
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/bomb.gif";
        }
    });

    return BombUnit;
});
