define([
    'backbone',
    'models/game_models/bomb_unit'
], function(
    Backbone,
    BombUnit
){
    var BossUnit = Backbone.Model.extend({	
    	x: 50,
    	y: 20,
    	image: new Image(),
    	canvasWidth: 0,
    	movingRight: true,
        timeSinceLastBombDrop: 0,
        timer: 0,
        gamelogic: null,
    	initialize: function(gamelogic) {
    		this.image.src = "/images/boss.png";	
            this.gamelogic = gamelogic;
            this.gamelogic.on('game_frame', this.onGameFrame, this);
    	},
		move: function() {		
			this.x = (this.movingRight) ? this.x + 5 : this.x - 5;
			
            if (this.x > this.canvasWidth - 111 || this.x < 0) {
                this.movingRight = !this.movingRight;
            }
		},
        refresh: function() {
            this.x = 50;
            this.y = 20;
            this.movingRight = true;

            this.timer = 0;
        },
        onGameFrame: function() {
            ++this.timeSinceLastBombDrop;

            if (this.timeSinceLastBombDrop >= 40) {
                var bombUnit = new BombUnit(this.gamelogic);

                bombUnit.canvasHeight = this.gamelogic.canvasHeight;                  
                bombUnit.x = this.x;
                bombUnit.y = this.y;

                this.timeSinceLastBombDrop = 0;
                this.trigger('bomb_dropped', bombUnit);
            }
        }
    });
    return BossUnit;
});
