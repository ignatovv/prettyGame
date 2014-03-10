define([
    'backbone'
], function(
    Backbone
){
    var playerUnit = Backbone.Model.extend({    
        x: 0,
        y: 0,
        image: new Image(),
        canvasWidth: 0,
        canvasHeight: 0,

        initialize: function() {          
            this.image.src = "/images/bomb.gif";   
        },
        move: function() {      
            this.y = this.y + 3;
        }     
    });
    return new playerUnit();
});
