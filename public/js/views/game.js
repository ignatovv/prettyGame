define([
    'backbone',
	'gyro',
    'tmpl/game',
], function(
    Backbone,
	gyro,
    tmpl
){

    var View = Backbone.View.extend({	
        template: tmpl,
        spaceshipImage: new Image(),
		backgroundImage: new Image(),
		bossImage: new Image(),
		stoneImage: new Image(),
        playerX: 0,
        playerY: 0,
        bossX: 0,
        bossRight: true,
        initialize: function () {
			this.spaceshipImage.src = "/images/spaceship.gif";
			this.backgroundImage.src = "/images/background.jpg";
			this.bossImage.src = "/images/boss.png";
			this.stoneImage.src = "/images/stone.gif";
        },
        updateCanvas: function () {
            var ctx = $(this.el).find(".game__canvas").get(0).getContext("2d");

			var canvasWidth = 320;
			var canvasHeight = 640;
			var rectWidth = 60;
			var rectHeight = 112;
			        
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

			ctx.drawImage(this.backgroundImage, 0, 0);
			ctx.drawImage(this.spaceshipImage, this.playerX, this.playerY);
			ctx.drawImage(this.bossImage, this.bossX, 20);
			ctx.drawImage(this.stoneImage, 50, 200);
        },
        render: function () {
			$(this.el).html(this.template());

			var max_accelerate = 15;
			var max_angle = 35;
			var min_angle = -35;
			var canvasWidth = 320;
			var canvasHeight = 640;
			var rectWidth = 60;
			var rectHeight = 112;
			var debug = $(this.el).find(".game__debug");
			
			this.playerX = (canvasWidth - rectWidth) / 2;
			this.playerY = canvasHeight - rectHeight - 20;
			
			this.bossX = 50;
			this.bossRight = true;
			
			var game = this;
			
			gyro.frequency = 10;
			gyro.stopTracking();
           	gyro.startTracking(function(o) {
				if (!o.x) {
					gyro.stopTracking();
					return;
				}
	
				debug.html("x=" + o.x.toFixed(1) + " y=" + o.y.toFixed(1) + " z=" + o.z.toFixed(1) + " alpha=" + o.alpha.toFixed(1) + " beta=" + o.beta.toFixed(1) + " gamma=" + o.gamma.toFixed(1) + " orientation=" + window.orientation);
        		
				var tilt;
				
				if (window.orientation == -90) tilt = (-1) * o.beta;
				else if (window.orientation == 90) tilt = o.beta;
				else if (window.orientation == 0) tilt = o.gamma;
				else if (window.orientation == 180) tilt = (-1) * o.gamma;
				
				if (tilt > max_angle) tilt = max_angle;
				else if (tilt < min_angle) tilt = min_angle;
				
				game.playerX += (tilt / max_angle) * max_accelerate;
				
				if (game.playerX < 0) game.playerX = 0;
				else if (game.playerX > canvasWidth - rectWidth) game.playerX = canvasWidth - rectWidth;
			
				game.bossX = (game.bossRight) ? game.bossX + 1 : game.bossX - 1;
			
        		if (game.bossX > canvasWidth - 111 || game.bossX < 0) game.bossRight = !game.bossRight;
        		
                game.updateCanvas();
			});
		
            return this;
        },
        remove: function() {
            alert(1);
        }
    });

    return new View();
});
