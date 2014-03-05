define([
    'backbone'
], function(
    Backbone
){
    var BossUnit = Backbone.Model.extend({	
    	x: 50,
    	y: 20,
    	canvasWidth: 0,
    	movingRight: true,
		move: function() {			
			this.x = (this.movingRight) ? this.x + 3 : this.x - 3;
			if (this.x > this.canvasWidth - 111 || this.x < 0) this.movingRight = !this.movingRight;
		}     
    });
    return new BossUnit();
});
