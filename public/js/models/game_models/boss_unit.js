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
		move: function(playerX) {		
			this.x = (this.movingRight) ? this.x + 3 : this.x - 3;
			if (this.x > this.canvasWidth - 111 || this.x < 0) this.movingRight = !this.movingRight;

            if(this.x == playerX || this.timer == 100) {
                this.bombDropped = true;
                this.timer = 0;            
            } else { this.timer = this.timer + 1; }

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
