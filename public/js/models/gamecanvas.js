define([
    'backbone',
	'gyro',
	'models/gamelogic',
	'models/game_models/stone_unit',
	'models/game_models/bomb_unit'
], function(
    Backbone,
	gyro,
	gamelogic,
	Stone,
	Bomb
){
    var Canvas = Backbone.Model.extend({	
        spaceshipImage: new Image(),
		backgroundImage: new Image(),
		stoneImage: new Image(),
		backgroundMaxY: 696,
		backgroundY: 0,
		frame: 0,
		timeSinceNewFrame: 0,
        initialize: function () {
			this.backgroundImage.src = "/images/game_space.png";
			this.stoneImage.src = "/images/stone.gif";
			this.fps = 60;
			Stone.loadImage();
			Bomb.loadImage();
        },
        updateCanvas: function () {
            var ctx = $(".game_canvas").get(0).getContext("2d");

			var canvasWidth = 1050;
			var canvasHeight = 680;
			var rectWidth = 60;
			var rectHeight = 112;
			        
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

			ctx.drawImage(this.backgroundImage, 0, this.backgroundY, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
			gamelogic.playerUnit.draw(ctx);
			ctx.drawImage(gamelogic.bossUnit.image, gamelogic.bossUnit.x, 20);

			gamelogic.bombs.forEach(function(bomb) {				
				ctx.drawImage(Bomb.image, bomb.x, bomb.y);			
			}, this);

			gamelogic.stones.forEach(function(stone) {				
				ctx.drawImage(Stone.image, stone.x, stone.y);			
			}, this);

			this.backgroundY = (this.backgroundY > 0) ? this.backgroundY - 1 : this.backgroundMaxY;

			return this;
        },
    });
	return new Canvas();
});
