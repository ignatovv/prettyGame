define([
    'backbone',
    'collections/stones'
], function(
    Backbone,
    stones
){
    var StoneUnit = Backbone.Model.extend({    
        x: 0,
        y: -50,
        canvasWidth: 0,
        canvasHeight: 0,
        exploded: false,
        gamelogic: null,
        initialize: function(gamelogic) {          
            this.gamelogic = gamelogic;
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
