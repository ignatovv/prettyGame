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
		bossImage: new Image(),
		stoneImage: new Image(),
		backgroundMaxY: 696,
		backgroundY: 0,
        initialize: function () {
			this.spaceshipImage.src = "/images/spaceship.gif";
			this.backgroundImage.src = "/images/background.png";
			this.bossImage.src = "/images/boss.png";
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
			ctx.drawImage(this.spaceshipImage, gamelogic.playerX, gamelogic.playerY);
			ctx.drawImage(this.bossImage, gamelogic.bossunit.x, 20);
			ctx.drawImage(this.stoneImage, 50, 200);

			this.backgroundY = (this.backgroundY > 0) ? this.backgroundY - 1 : this.backgroundMaxY;

			return this;
        },
    });
	return new Canvas();
});
