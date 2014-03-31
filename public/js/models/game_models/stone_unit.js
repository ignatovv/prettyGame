define([
    'backbone',
    'models/gamelogic'
], function(
    Backbone,
    gamelogic
){
    var stoneUnit = Backbone.Model.extend({    
        x: 0,
        y: 0,
        image: new Image(),
        canvasWidth: 0,
        canvasHeight: 0,
        exploded: false,
        deleted: false,

        initialize: function() {          
            this.image.src = "/images/stone.gif";   
        },
        move: function(playerX, playerY) {            
            this.y = this.y + 10;
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
                this.deleted = true;
            }     
        }    
    });
    return stoneUnit;
});
