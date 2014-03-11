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
			ctx.drawImage(this.stoneImage, 50, 200);

			if(gamelogic.bossUnit.bombDropped){
				ctx.drawImage(gamelogic.bombUnit.image, gamelogic.bombUnit.x, gamelogic.bombUnit.y);
			
			}

			this.backgroundY = (this.backgroundY > 0) ? this.backgroundY - 1 : this.backgroundMaxY;

			return this;
        },
    });
	return new Canvas();
});
