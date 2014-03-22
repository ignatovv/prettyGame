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
    	initialize: function() {
    		this.image.src = "/images/boss.png";	
    	},
		move: function() {		
			this.x = (this.movingRight) ? this.x + 3 : this.x - 3;
			if (this.x > this.canvasWidth - 111 || this.x < 0) this.movingRight = !this.movingRight;
		},
        dropBomb: function(e) {
            if(!this.bombDropped && (this.x == e)) {
                this.bombDropped = true;
                return true;
            }
        },
        refresh: function() {
            this.x = 50;
            this.y = 20;
            this.movingRight = true;
            this.bombDropped = false;
        }    
    });
    return new bossUnit();
});
