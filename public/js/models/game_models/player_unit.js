define([
    'backbone'
], function(
    Backbone
){
    var playerUnit = Backbone.Model.extend({	
    	x: 0,
    	y: 0,
        hp:1,
        movingRight: false,
        movingLeft: false,
    	image: new Image(),
    	canvasWidth: 0,
        canvasHeight: 0,

    	initialize: function() {
            this.x = 500;
            this.y =  520;            
    		this.image.src = "/images/spaceship.gif";	
    	},
		move: function() {		
			if(this.movingLeft) this.x = this.x - 3;
            if(this.movingRight) this.x = this.x + 3;
			if(this.x > this.canvasWidth - 61)  this.x = this.canvasWidth - 61;
            else if(this.x < 0) this.x = 0;
            if(this.hp == 0){ 
               // this.image.src = "/images/bomb.gif";    
            }
		},        
        refresh: function(){            
        }
    });
    return new playerUnit();
});
