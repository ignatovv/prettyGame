 define([
    'backbone',
	'models/gamelogic',
	'models/game_models/player_unit',
	'models/game_models/boss_unit',
	'models/game_models/stone_unit',
	'models/game_models/bomb_unit',
	'models/game_models/slug_unit',
	'models/game_models/blast_unit',
	'models/game_models/clever_bomb_unit',
	'models/game_models/powerup_unit',	
	'models/game_models/explosion_unit',
	'collections/effects'
], function(
    Backbone,
	gamelogic,
	PlayerUnit,
	BossUnit,
	StoneUnit,
	BombUnit,
	SlugUnit,
	Blastunit,
	CleverBombUnit,
	PowerupUnit,
	ExplosionUnit,
	effects
){
    var Canvas = Backbone.Model.extend({	
		backgroundImage: new Image(),
		backgroundMaxY: 696,
		backgroundY: 0,
		backgroundSpeed: 2,
		scoreBarBackgroundImage: new Image(),
		hpBarBackgroundImage: new Image(),
		hpBarValueGreenImage: new Image(),
		hpBarValueRedImage: new Image(),
		hitEffectRemainingTime: 0,
        initialize: function () {
			this.backgroundImage.src = "/images/game_space.png";
			this.scoreBarBackgroundImage.src = "/images/score_bar_background.png";
			this.hpBarBackgroundImage.src = "/images/hp_bar_background.png";
			this.hpBarValueGreenImage.src = "/images/hp_bar_value_green.gif";
			this.hpBarValueRedImage.src = "/images/hp_bar_value_red.gif";
			this.fps = 60;
			this.loadGameModelsImages();
        },
        loadGameModelsImages: function() {
        	PlayerUnit.loadImage();
        	BossUnit.loadImage();
        	StoneUnit.loadImage();
        	BombUnit.loadImage();
        	SlugUnit.loadImage();
        	ExplosionUnit.loadImage();
        	Blastunit.loadImage();
        	CleverBombUnit.loadImage();
        	ExplosionUnit.loadImage();
        	PowerupUnit.loadImage();
        },
        updateCanvas: function () {
            var ctx = $(".game_canvas").get(0).getContext("2d");

            ctx.clearRect(0, 0, gamelogic.canvasWidth, gamelogic.canvasHeight);
            
            this.drawBackground(ctx);

			if (gamelogic.playerUnit.hp > 0)
				gamelogic.playerUnit.draw(ctx);

			gamelogic.stones.forEach(function(stone) {				
				stone.draw(ctx);
			});
			gamelogic.powerups.forEach(function(powerup) {
				powerup.draw(ctx);
			});
			gamelogic.bombs.forEach(function(bomb) {		
				bomb.draw(ctx);
			});

			gamelogic.slugs.forEach(function(slug) {
				slug.draw(ctx);
			});

			gamelogic.bossUnit.draw(ctx);

			effects.forEach(function(effect) {				
				effect.draw(ctx);
			});

			this.drawHitEffectIfNeeded(ctx);
			this.drawScoreBar(ctx, gamelogic.scores, 10, gamelogic.canvasHeight - (25 + 10) * 2);
			this.drawHpBar(ctx, "PLAYER", 10, gamelogic.canvasHeight - 25 - 10, this.hpBarValueGreenImage, gamelogic.playerUnit.hp / gamelogic.playerUnit.max_hp);
			this.drawHpBar(ctx, "BOSS", gamelogic.canvasWidth - 250 - 10, gamelogic.canvasHeight - 25 - 10, this.hpBarValueRedImage, gamelogic.bossUnit.hp / 10);


			return this;
        },
        drawHitEffectIfNeeded: function(ctx) {
			if (gamelogic.playerUnit.hited || this.hitEffectRemainingTime > 0) {
				if (gamelogic.playerUnit.hited) {
					this.hitEffectRemainingTime = 10;
				}

				ctx.rect(0, 0, gamelogic.canvasWidth, gamelogic.canvasHeight);
				ctx.fillStyle = 'rgba(255, 0, 0, ' + 0.5 * 0.1 * this.hitEffectRemainingTime + ')';
				ctx.fill();

				gamelogic.playerUnit.hited = false;
				--this.hitEffectRemainingTime;
			}
        },
        drawScoreBar: function(ctx, score, x, y) {
        	ctx.drawImage(this.scoreBarBackgroundImage, x, y);

			ctx.font = "12px Courier New";
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.fillText("SCORE", x + 30, y + 17);

			ctx.fillText(score, x + 94, y + 17);
        },
        drawHpBar: function(ctx, text, x, y, valueImage, hpPerctantage) {
        	ctx.drawImage(this.hpBarBackgroundImage, x, y);
			ctx.font = "12px Courier New";
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.fillText(text, x + 30, y + 17);

			ctx.drawImage(valueImage, 0, 0, 179 * hpPerctantage, 8, x + 60, y + 9, 179 * hpPerctantage, 8);
        },
        drawBackground: function(ctx) {
        	ctx.drawImage(this.backgroundImage, 0, this.backgroundY, gamelogic.canvasWidth, gamelogic.canvasHeight, 0, 0, gamelogic.canvasWidth, gamelogic.canvasHeight);
        	if (!gamelogic.gamePaused) {
        		this.backgroundY = (this.backgroundY > 0) ? this.backgroundY - this.backgroundSpeed : this.backgroundMaxY;
        	}
        }
    });
	return new Canvas();
});
