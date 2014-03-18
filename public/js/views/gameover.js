define([
    'backbone',
    'tmpl/gameover',
    'models/gamelogic',
    'models/score',
    'collections/scores'
], function(
    Backbone,
    tmpl,
    gamelogic,
    Score, 
    scores
){

    var View = Backbone.View.extend({
        template: tmpl,
        events: {
            "click .gameover__submit": "submitScore"
        },
        initialize: function () {
			this.$el.hide();
        },
        render: function () {
            this.$el.html(this.template());
            return this;
        },
        show: function() {
            this.$el.find(".score").text(gamelogic.scores);
			this.$el.show();
        },
		hide: function() {
			this.$el.hide();
		},
        submitScore: function() {
            scores.create({ name: this.$el.find('.gameover__name').val(), score: gamelogic.scores});
            location.href = "#scoreboard";
        }
    });

    return new View();
});
