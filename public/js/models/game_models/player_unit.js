define([
    'backbone',
    'models/game_models/game_model',
    'models/game_models/slug_unit',
], function(
    Backbone,
    GameModel,
    SlugUnit
){
    var PlayerUnit = GameModel.extend({
        x: 500,
        y: 520,
        width: 60,
        height: 112,
        frames: [4, 4, 4, 4],
        hp: 6,
        max_hp: 6,
        timeSinceLastShoot: 0,
        powerup_timer: 0,
        powerups: 'none',
        speed: 0,
        hited: false,
    	initialize: function(gamelogic) {
            PlayerUnit.__super__.initialize(gamelogic, this);
            this.image = PlayerUnit.image;
    	},
		move: function() {		
			if (this.gamelogic.leftButtonPressed) {
                this.x -= 5;
            }
            
            if (this.gamelogic.rightButtonPressed) {
                this.x += 5;
            }
			
            if (this.x + this.width > this.gamelogic.canvasWidth - 1) {
                this.x = this.gamelogic.canvasWidth - this.width - 1;
            } else if (this.x < 0) {
                this.x = 0;
            }
            
            if (this.hp == 0) {
               //this.image.src = "/images/bomb.gif";
            }            
            this.shoot();
            --this.powerup_timer;
		},
        shoot: function() {
            ++this.timeSinceLastShoot;

            if (this.gamelogic.spacebarButtonPressed && this.timeSinceLastShoot >= 10) {
                if(this.powerups == 'none') {

                    var slugUnit = new SlugUnit(this.gamelogic);

                    slugUnit.x = this.x + (this.width - slugUnit.width) / 2;
                    slugUnit.y = this.y;                
              
                    this.gamelogic.soundFactory.playPlayerShoot();
                    this.trigger('player_shot', slugUnit);
                } else if(this.powerups == 'triple_shot') {
                    var slugUnit1 = new SlugUnit(this.gamelogic);
                    var slugUnit2 = new SlugUnit(this.gamelogic);
                    var slugUnit3 = new SlugUnit(this.gamelogic);

                    slugUnit1.x = this.x;
                    slugUnit1.y = this.y + 40;                
                    
                    slugUnit2.x = this.x + this.width / 2 - slugUnit2.width / 2;
                    slugUnit2.y = this.y;                
                    
                    slugUnit3.x = this.x + this.width;
                    slugUnit3.y = this.y + 40;                
              
                    this.gamelogic.soundFactory.playPlayerTripleShoot();

                    this.trigger('player_shot', slugUnit1);
                    this.trigger('player_shot', slugUnit2);
                    this.trigger('player_shot', slugUnit3);
                    
                    if(this.powerup_timer <= 0) {
                        this.powerups = 'none';
                    }
                }

                this.timeSinceLastShoot = 0;
            }
        },
        getPowerup: function(){
            this.gamelogic.soundFactory.playPowerUp();
            this.powerups = "triple_shot";
            this.powerup_timer = 200;
        },
        hit: function(power) {
            this.hp -= power;
            
            if (this.hp <= 0) {
                this.explode();
            } else {
                this.hited = true;
            }
        },
        explode: function() {
            this.gamelogic.soundFactory.playExplosion();
            this.gamelogic.gameOver = true;
            this.gamelogic.explode(this);
        },
        contains: function(canvas_x, canvas_y) {
            var x = canvas_x - this.x - 2;
            var y = canvas_y - this.y - 2;
            var width = this.width - 2 * 2;
            var height = 66;
            
            return y >= height * (1 - 2 * x / width) && y >= height * (2 * x / width - 1) && y <= 2 + height;
        }
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/spaceship.gif";
        }
    });

    return PlayerUnit;
});
