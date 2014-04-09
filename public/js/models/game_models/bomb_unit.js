define([
    'backbone',
    'models/gamelogic',
    'collections/bombs'
], function(
    Backbone,
    gamelogic,
    bombs
){
    var bombUnit = Backbone.Model.extend({    
        x: 0,
        y: 0,
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
    return bombUnit;
});
