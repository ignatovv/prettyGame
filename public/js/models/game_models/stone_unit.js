define([
    'backbone',
    'models/game_models/game_model',
    'models/game_models/explosion_unit',
    'collections/stones',
    'collections/effects'
], function(
    Backbone,
    GameModel,
    ExplosionUnit,
    stones,
    effects
){
    var StoneUnit = GameModel.extend({            
        width: 48,
        height: 50,
        y: 0,
        hp: 3,
        speed: 3,
        power: 2,
        initialize: function(gamelogic) {     
            StoneUnit.__super__.initialize(gamelogic, this);
            this.image = StoneUnit.image;   
            this.y = - this.height;         
        },
        move: function() {    
            if(this.gamelogic.bossUnleashed) {        
                this.y += this.speed;

                if (this.y > this.gamelogic.canvasHeight) {           
                    stones.remove(this);
                }
            }
            else {
                this.y += this.speed * 2;

                if (this.y > this.gamelogic.canvasHeight) {           
                    stones.remove(this);
                }
            }
        },
        hit: function(power) {
            this.hp = this.hp - power;

            if (this.hp <= 0) {
                this.explode();
            }
        },
        explode: function() {
            this.gamelogic.soundFactory.playExplosion2();

            stones.remove(this);

            var explosionUnit = new ExplosionUnit(this.gamelogic);

            explosionUnit.x = this.x + (this.width - explosionUnit.width) / 2;
            explosionUnit.y = this.y + (this.height - explosionUnit.height) / 2;
            explosionUnit.speed = this.speed;

            effects.add(explosionUnit);

            this.gamelogic.scores = this.gamelogic.scores + 3;
        },
        contains: function(canvas_x, canvas_y) {
            var x = canvas_x - this.x;
            var y = canvas_y - this.y;
            var r = this.width / 2;
            
            x -= this.width / 2;
            y -= this.height / 2;
            
            return y >= (-1) * Math.sqrt(r * r - x * x) && y <= Math.sqrt(r * r - x * x);
        }
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/stone.gif";
        }
    });

    return StoneUnit;
});
