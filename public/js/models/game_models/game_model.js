define([
    'backbone',
], function(
    Backbone
){
    var GameModel = Backbone.Model.extend({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        currentFrame: 0,
        timeSinceNewFrame: 0,
        image: new Image(),
        gamelogic: null,
        initialize: function(gamelogic, model) {
            this.gamelogic = gamelogic;
            this.gamelogic.on('game_frame', this.onGameFrame, model);
        },
        timeElapsed: function() {
            if (!this.frames) {
                return;
            }

            ++this.timeSinceNewFrame;

            if (this.timeSinceNewFrame >= this.frames[this.currentFrame]) {
                ++this.currentFrame;
                this.timeSinceNewFrame = 0;
                
                if (this.currentFrame >= this.frames.length) {
                    this.currentFrame = 0;
                }
            }
        },
        onGameFrame: function() {
            this.timeElapsed();
        },
        draw: function(ctx) {
            ctx.drawImage(this.image, this.width * this.currentFrame, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    });
    return GameModel;
});
