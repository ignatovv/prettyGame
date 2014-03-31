define([
    'backbone',
	'gyro',
	'models/gamelogic'
], function(
    Backbone,
	gyro,
	gamelogic
){
    var Canvas = Backbone.Model.extend({	
        spaceshipImage: new Image(),
		backgroundImage: new Image(),
		stoneImage: new Image(),
		backgroundMaxY: 696,
		backgroundY: 0,
        initialize: function () {
			this.backgroundImage.src = "/images/background.png";
			this.stoneImage.src = "/images/stone.gif";
			this.fps = 60;
        },
        updateCanvas: function () {
            var ctx = $(".game__canvas").get(0).getContext("2d");

			var canvasWidth = 1050;
			var canvasHeight = 680;
			var rectWidth = 60;
			var rectHeight = 112;
			        
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

			ctx.drawImage(this.backgroundImage, 0, this.backgroundY, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
			ctx.drawImage(gamelogic.playerUnit.image, gamelogic.playerUnit.x, gamelogic.playerUnit.y);
			ctx.drawImage(gamelogic.bossUnit.image, gamelogic.bossUnit.x, 20);
		
			gamelogic.bombs.forEach(function(bomb) {				
					ctx.drawImage(bomb.image, bomb.x, bomb.y);			
			}, this);


			gamelogic.stones.forEach(function(stone) {				
					ctx.drawImage(stone.image, stone.x, stone.y);			
			}, this);

			this.backgroundY = (this.backgroundY > 0) ? this.backgroundY - 1 : this.backgroundMaxY;

			return this;
        },
    });
	return new Canvas();
});
