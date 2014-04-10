define([
    'backbone',
    'models/game_models/game_model',
    'collections/stones'
], function(
    Backbone,
    GameModel,
    stones
){
    var StoneUnit = GameModel.extend({    
        y: -50,
        width: 48,
        height: 50,
        exploded: false,
        initialize: function(gamelogic) {     
            StoneUnit.__super__.initialize(gamelogic, this);
            this.image = StoneUnit.image;
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
                stones.remove(this);
                this.gamelogic.scores = this.gamelogic.scores + 2;
            }
        }
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/stone.gif";
        }
    });

    return StoneUnit;
});
