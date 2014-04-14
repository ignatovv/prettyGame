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
    var CleverBombUnit = GameModel.extend({    
        width: 50,
        height: 50,     
        hp: 2,
        speed: 4,
        speed_x: 0,
        power: 1,
        initialize: function(gamelogic) {          
            CleverBombUnit.__super__.initialize(gamelogic, this);
            this.image = CleverBombUnit.image;
        },
        move: function() {            
            this.y += this.speed;
            if ((this.speed_x / this.speed) > ((this.gamelogic.playerUnit.x - this.x)/(this.gamelogic.playerUnit.y - this.y)))
                this.speed_x -= 0.1;
            else
                this.speed_x += 0.1;
            this.x +=this.speed_x;
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

            this.gamelogic.explode(this);

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

    return CleverBombUnit;
});
