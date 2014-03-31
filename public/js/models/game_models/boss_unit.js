define([
    'backbone'
], function(
    Backbone
){
    var bossUnit = Backbone.Model.extend({	
    	x: 50,
    	y: 20,
    	image: new Image(),
    	canvasWidth: 0,
    	movingRight: true,
        bombDropped: false,
        timer: 0,
    	initialize: function() {
    		this.image.src = "/images/boss.png";	
    	},
		move: function() {		
			this.x = (this.movingRight) ? this.x + 5 : this.x - 5;
			if (this.x > this.canvasWidth - 111 || this.x < 0) this.movingRight = !this.movingRight;            
            if(this.timer > 40) {
                this.bombDropped = true;
                this.timer = 0;
            }                    
            this.timer = this.timer + 1;             
		},
        refresh: function() {
            this.x = 50;
            this.y = 20;
            this.movingRight = true;
            this.bombDropped = false;
            this.timer = 0;
        }    
    });
    return new bossUnit();
});
