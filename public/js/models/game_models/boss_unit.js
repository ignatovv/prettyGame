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
        hp: 0,
        max_hp: 49,
        blasts: 0,
        speed: 5,
        busted: false,
        damaged: false,
        damagedImage: new Image(),
    	initialize: function(gamelogic) {
    		BossUnit.__super__.initialize(gamelogic, this);
            this.image = BossUnit.image;
            this.damagedImage = BossUnit.damagedImage;
            this.hp = this.max_hp;
    	},
        unleash: function() {            
            this.x = (this.gamelogic.canvasWidth - this.width) / 2;
            this.y = - this.height;            
        },
		move: function() {	

            if(this.damaged && this.gamelogic.timer % 3 == 0) 
                this.damaged = false;

            if (this.y < 0) {
                if(this.gamelogic.timer % 5 == 0)
                    ++this.y;
            }
            else if(this.hp > 0) {
                {
        			this.x = (this.movingRight) ? this.x + this.speed : this.x - this.speed;
        			
                    if (this.x > this.gamelogic.canvasWidth - this.width || this.x < 0) {
                        this.movingRight = !this.movingRight;
                    }

                    this.throwBombIfNeeded();
                }
            }
            else if (this.hp <= 0 && !this.busted) {
                this.gamelogic.soundFactory.stopBossMusic();
                this.gamelogic.soundFactory.playEndingMusic();
                this.gamelogic.tactsAfterGameOver = 200;
                this.gamelogic.gameOver = true;
                this.busted = true;  
                this.gamelogic.scores += 50;
                this.gamelogic.soundFactory.playExplosion();          
            }        
		},
        hit: function(power) {
            this.damaged = true;
            this.gamelogic.soundFactory.playHit(); 

            if(this.y >= 0) {
                this.hp -= power;                       
                if (this.hp % 10 == 0 && this.hp > 0) {
                    --this.hp;
                    this.gamelogic.scores += 10;
                
                    var blastUnit = new BlastUnit(this.gamelogic);
                    blastUnit.x = this.x + this.width / 2 - blastUnit.width / 2;
                    blastUnit.y = this.y;
                    this.blasts = this.blasts + 4;
                    
                    this.gamelogic.soundFactory.playBlastShoot();
                    this.timeSinceLastBlast = 0;
                    this.trigger('bomb_dropped', blastUnit);   
                }
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
        },
        draw: function(ctx) {
            if (this.gamelogic.bossUnleashed && this.hp > 0) {
                if (!this.damaged)
                    ctx.drawImage(this.image, this.width * this.currentFrame, 0, this.width, this.height, this.x, this.y, this.width, this.height);
                else
                    ctx.drawImage(this.damagedImage, this.width * this.currentFrame, 0, this.width, this.height, this.x, this.y, this.width, this.height);
            }
        }

    }, {
        image: new Image(),
        damagedImage: new Image(),
        loadImage: function() {
            this.image.src = "/images/boss.png";
            this.damagedImage.src = "/images/boss_damaged.png";
        }
    });

    return BossUnit;
});
