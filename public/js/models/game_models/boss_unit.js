define([
    'backbone',
    'models/game_models/game_model',
    'models/game_models/bomb_unit',
    'models/game_models/blast_unit',
    'models/game_models/clever_bomb_unit'
], function(
    Backbone,
    GameModel,
    BombUnit,
    BlastUnit,
    CleverBombUnit
){
    var BossUnit = GameModel.extend({	
    	x: 50,
    	y: 20,
        width: 111,
        height: 60,
    	movingRight: true,
        timeSinceLastBombDrop: 0,
        timeSinceLastBlast:0,
        timer: 0,
        hp: 10,
        blasts: 0,
        speed: 5,
    	initialize: function(gamelogic) {
    		BossUnit.__super__.initialize(gamelogic, this);
            this.image = BossUnit.image;
    	},
        unleash: function() {
            this.gamelogic.bossUnleashed = true;
            this.x = (this.gamelogic.canvasWidth - this.width) / 2;
            this.y = - this.height;            
        },
		move: function() {	

            if (this.y < 0) {
                if(this.gamelogic.timer % 2)
                    ++this.y;
            }
            else {
    			this.x = (this.movingRight) ? this.x + this.speed : this.x - this.speed;
    			
                if (this.x > this.gamelogic.canvasWidth - this.width || this.x < 0) {
                    this.movingRight = !this.movingRight;
                }

                this.throwBombIfNeeded();
            }
		},
        hit: function(power) {
            this.hp = this.hp - power;

            this.gamelogic.soundFactory.playHit();

            if (this.hp <= 0) {
                this.hp = 10;
                this.gamelogic.scores = this.gamelogic.scores + 10;
            
                var blastUnit = new BlastUnit(this.gamelogic);
                blastUnit.x = this.x + this.width / 2 - blastUnit.width / 2;
                blastUnit.y = this.y;
                this.blasts = this.blasts + 4;
                
                this.gamelogic.soundFactory.playBlastShoot();
                this.timeSinceLastBlast = 0;
                this.trigger('bomb_dropped', blastUnit);   
            }
        },
        throwBombIfNeeded: function() {
            ++this.timeSinceLastBombDrop;

            if (this.timeSinceLastBombDrop >= 40) {
                var bombUnit;
                if (Math.random()*100 > 20) 
                    bombUnit = new BombUnit(this.gamelogic);
                else 
                    bombUnit = new CleverBombUnit(this.gamelogic);
                bombUnit.x = this.x;
                bombUnit.y = this.y;

                this.timeSinceLastBombDrop = 0;
                this.trigger('bomb_dropped', bombUnit);
            }

            ++this.timeSinceLastBlast;

            if(this.blasts > 0 && this.timeSinceLastBlast > 5) {
                var blastUnit = new BlastUnit(this.gamelogic);
                blastUnit.x = this.x + this.width / 2 - blastUnit.width / 2;
                blastUnit.y = this.y;
                this.blasts = this.blasts - 1;
                this.timeSinceLastBlast = 0;
                this.trigger('bomb_dropped', blastUnit);  
            }
        },
        contains: function() {
            return true;
        }

    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/boss.png";
        }
    });

    return BossUnit;
});
