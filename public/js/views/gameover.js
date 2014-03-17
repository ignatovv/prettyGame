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
            "click .score_submit__button": "submitScore"
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
/*
            scores.add(new Score({ name: this.$el.find('.score_submit__name').val(), score: gamelogic.scores}));
            scores.sync();
*/
            $.ajax({
                url: "/scores",
                type: "POST",
                data: { name: this.$el.find('.score_submit__name').val(), score:gamelogic.scores }
            }).done(function() {
                //alert("success");
            }).fail(function() { 
                //alert("fail");
            }).always(function() {
                location.href = "#scoreboard";
            });
        }
    });

    return new View();
});
