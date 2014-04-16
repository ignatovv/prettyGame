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
        speed_y: 0,
        speed_x: 0,
        max_speed: 5,
        alfa: 0,
        power: 1,
        max_angle: 80,
        initialize: function(gamelogic) {          
            CleverBombUnit.__super__.initialize(gamelogic, this);
            this.image = CleverBombUnit.image;
        },
        move: function() {
            var dist_y = this.gamelogic.playerUnit.y - this.y;
            var dist_x = this.gamelogic.playerUnit.x - this.x;
            if (dist_x * dist_x + dist_y * dist_y < 20000)
                this.currentFrame = 1;
            else
                this.currentFrame = 0;
            var step = 0.02;
            if (this.y < this.gamelogic.playerUnit.y) {
                var beta = Math.atan(dist_x/dist_y)
                if (Math.abs(this.alfa) < Math.PI * this.max_angle/360) 
                    if (this.alfa > beta)
                        this.alfa -= step;
                    else 
                        this.alfa += step;
                else
                    if (this.alfa > beta && this.alfa > 0)
                        this.alfa -= step;
                    else if (this.alfa < beta && this.alfa < 0)
                        this.alfa += step;
            }
            this.speed_x = this.max_speed * Math.sin(this.alfa);
            this.speed_y = this.max_speed * Math.cos(this.alfa);
            this.x += this.speed_x;
            this.y += this.speed_y;
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
            this.gamelogic.soundFactory.playExplosion2();
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
