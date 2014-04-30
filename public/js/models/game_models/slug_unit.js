define([
    'backbone',
    'models/game_models/game_model',
    'collections/slugs'
], function(
    Backbone,
    GameModel,
    slugs
){
    var SlugUnit = GameModel.extend({    
        width: 8,
        height: 17,
        power: 1,
        upward: true, 
        speed_x: 10,
        initialize: function(gamelogic) {          
            SlugUnit.__super__.initialize(gamelogic, this);
            this.image = SlugUnit.image;
        },
        move: function() {  
            if(this.upward)  {        
                this.y -= this.speed_x;
                if (this.y < 0) {               
                    slugs.remove(this);                
                }  
            }
            else {
                this.y += this.speed_x;            
                if(this.y > this.gamelogic.canvasHeight) {

                }
            }
        },
        contains: function(canvas_x, canvas_y) { 
             // var x = canvas_x - this.x;
             // var y = canvas_y - this.y; 
             // return  canvas_x >= x && canvas_y >= y && (canvas_x - x) < this.width && (canvas_y - y) < this.height;
            return true;
        },
    }, {
        image: new Image(),
        loadImage: function() {
            this.image.src = "/images/slug.png";
        }
    });

    return SlugUnit;
});
