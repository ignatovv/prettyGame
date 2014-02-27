define([
    'backbone',
	'gyro',
	'models/gamelogic'
], function(
    Backbone,
	gyro,
	gamelogic
){

    var Model = Backbone.Model.extend({	
        spaceshipImage: new Image(),
		backgroundImage: new Image(),
		bossImage: new Image(),
		stoneImage: new Image(),
        initialize: function () {
			this.spaceshipImage.src = "/images/spaceship.gif";
			this.backgroundImage.src = "/images/background.jpg";
			this.bossImage.src = "/images/boss.png";
			this.stoneImage.src = "/images/stone.gif";
        },
        updateCanvas: function () {
            var ctx = $(".game__canvas").get(0).getContext("2d");

			var canvasWidth = 320;
			var canvasHeight = 640;
			var rectWidth = 60;
			var rectHeight = 112;
			        
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

			ctx.drawImage(this.backgroundImage, 0, 0);
			ctx.drawImage(this.spaceshipImage, gamelogic.playerX, gamelogic.playerY);
			ctx.drawImage(this.bossImage, gamelogic.bossX, 20);
			ctx.drawImage(this.stoneImage, 50, 200);

			return this;
        }
    });

    return new Model();
});
