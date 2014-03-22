define([
    'backbone'
], function(
    Backbone
){
    var stoneUnit = Backbone.Model.extend({    
        x: 0,
        y: 0,
        image: new Image(),
        canvasWidth: 0,
        canvasHeight: 0,
        isVisible:false,

        initialize: function() {          
            this.image.src = "/images/stone.gif";   
        },
        move: function() {      
            this.y = this.y + 10;
        },
        refresh: function(){
            this.x = 0;
            this.y = 0;
            this.isVisible = false;

        }     
    });
    return new stoneUnit();
});
