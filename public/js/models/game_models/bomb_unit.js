define([
    'backbone',
    'models/game_models/game_model',
    'models/game_models/explosion_unit',
    'collections/bombs',
    'collections/effects'
], function(
    Backbone,
    GameModel,
    ExplosionUnit,
    bombs,
    effects
){
    var BombUnit = GameModel.extend({    
        width: 50,
        height: 50,    
        frames: [30, 30, 30, 30, 30],
        hp: 2,
        speed: 5,
        initialize: function(gamelogic) {          
            BombUnit.__super__.initialize(gamelogic, this);
            this.image = BombUnit.image;
        },
        move: function() {            
            this.y += this.speed;
            
            if (this.y > this.gamelogic.canvasHeight) {  
                bombs.remove(this);
                this.gamelogic.scores = this.gamelogic.scores + 1;
            }  
        },
        hit: function(power) {
            this.hp = this.hp - power;

            if (this.hp <= 0) {
                this.explode();
            }
        },
        explode: function() {
            new Audio('/sounds/explosion2.wav').play();

            bombs.remove(this);

            var explosionUnit = new ExplosionUnit(this.gamelogic);

            explosionUnit.x = this.x + (this.width - explosionUnit.width) / 2;
            explosionUnit.y = this.y + (this.height - explosionUnit.height) / 2;
            explosionUnit.speed = this.speed;

            effects.add(explosionUnit);

            this.gamelogic.scores = this.gamelogic.scores + 2;
        },
        contains: function(canvas_x, canvas_y) {
            var x = canvas_x - this.x;
            var y = canvas_y - this.y;
            var r = 17;

            x -= this.width / 2;
            y -= this.height / 2;
            
            return y >= (-1) * Math.sqrt(r * r - x * x) + r && y <= Math.sqrt(r * r - x * x);
        }
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/bomb.gif";
        }
    });

    return BombUnit;
});
