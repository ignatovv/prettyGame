define([
    'backbone'
], function(
    Backbone
){
    var PlayerUnit = Backbone.Model.extend({	
    	x: 0,
    	y: 0,
        width: 60,
        height: 112,
        currentFrame: 0,
        timeSinceNewFrame: 0,
        frames: [6, 6, 6, 6],
        hp: 1,
        movingRight: false,
        movingLeft: false,
    	image: new Image(),
        gamelogic: null,
    	initialize: function(gamelogic) {
            this.x = 500;
            this.y =  520;
    		this.image.src = "/images/spaceship.gif";	
            this.gamelogic = gamelogic;
            this.gamelogic.on('game_frame', this.onGameFrame, this);
    	},
		move: function() {		
			if (this.movingLeft) this.x = this.x - 3;
            if (this.movingRight) this.x = this.x + 3;
			if (this.x > this.gamelogic.canvasWidth - 61)  this.x = this.gamelogic.canvasWidth - 61;
            else if (this.x < 0) this.x = 0;
            
            if (this.hp == 0) { 
               //this.image.src = "/images/bomb.gif";    
            }
		},        
        refresh: function() {            
        },
        timeElapsed: function() {
            ++this.timeSinceNewFrame;

            if (this.timeSinceNewFrame >= this.frames[this.currentFrame]) {
                ++this.currentFrame;
                this.timeSinceNewFrame = 0;
                
                if (this.currentFrame >= this.frames.length) {
                    this.currentFrame = 0;
                }
            }
        },
        onGameFrame: function() {
            this.timeElapsed();
        },
        draw: function(ctx) {
            ctx.drawImage(this.image, this.width * this.currentFrame, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    });
    return PlayerUnit;
});
