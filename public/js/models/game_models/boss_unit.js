define([
    'backbone',
    'models/game_models/game_model',
    'models/game_models/bomb_unit'
], function(
    Backbone,
    GameModel,
    BombUnit
){
    var BossUnit = GameModel.extend({	
    	x: 50,
    	y: 20,
        width: 111,
        height: 60,
    	movingRight: true,
        timeSinceLastBombDrop: 0,
        timer: 0,
    	initialize: function(gamelogic) {
    		BossUnit.__super__.initialize(gamelogic, this);
            this.image = BossUnit.image;
    	},
		move: function() {		
			this.x = (this.movingRight) ? this.x + 5 : this.x - 5;
			
            if (this.x > this.gamelogic.canvasWidth - 111 || this.x < 0) {
                this.movingRight = !this.movingRight;
            }

            this.throwBombIfNeeded();
		},
        throwBombIfNeeded: function() {
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
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/boss.png";
        }
    });

    return BossUnit;
});
