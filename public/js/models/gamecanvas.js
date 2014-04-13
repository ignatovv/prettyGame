define([
    'backbone',
	'gyro',
	'models/gamelogic',
	'models/game_models/player_unit',
	'models/game_models/boss_unit',
	'models/game_models/stone_unit',
	'models/game_models/bomb_unit',
	'models/game_models/slug_unit',
	'models/game_models/blast_unit'
		
], function(
    Backbone,
	gyro,
	gamelogic,
	PlayerUnit,
	BossUnit,
	StoneUnit,
	BombUnit,
	SlugUnit,
	Blastunit
){
    var Canvas = Backbone.Model.extend({	
		backgroundImage: new Image(),
		backgroundMaxY: 696,
		backgroundY: 0,
		backgroundSpeed: 2,
        initialize: function () {
			this.backgroundImage.src = "/images/game_space.png";
			this.fps = 60;
			this.loadGameModelsImages();
        },
        loadGameModelsImages: function() {
        	PlayerUnit.loadImage();
        	BossUnit.loadImage();
        	StoneUnit.loadImage();
        	BombUnit.loadImage();
        	SlugUnit.loadImage();
        	Blastunit.loadImage();
        },
        updateCanvas: function () {
            var ctx = $(".game_canvas").get(0).getContext("2d");

            ctx.clearRect(0, 0, gamelogic.canvasHeight, gamelogic.canvasHeight);

			this.drawBackground(ctx);
			gamelogic.playerUnit.draw(ctx);

			gamelogic.bombs.forEach(function(bomb) {		
				bomb.draw(ctx);
			});

			gamelogic.stones.forEach(function(stone) {				
				stone.draw(ctx);
			});

			gamelogic.slugs.forEach(function(slug) {
				slug.draw(ctx);
			});

			gamelogic.bossUnit.draw(ctx);

			return this;
        },
        drawBackground: function(ctx) {
        	ctx.drawImage(this.backgroundImage, 0, this.backgroundY, gamelogic.canvasWidth, gamelogic.canvasHeight, 0, 0, gamelogic.canvasWidth, gamelogic.canvasHeight);
        	
        	this.backgroundY = (this.backgroundY > 0) ? this.backgroundY - this.backgroundSpeed : this.backgroundMaxY;
        }
    });
	return new Canvas();
});
