define([
    'backbone',
    'tmpl/scoreboard',
    'models/score',
    'collections/scores'
], function(
    Backbone,
    tmpl,
    Score,
    scores
){

    var View = Backbone.View.extend({
        template: tmpl,
        initialize: function () {
            scores.add(new Score({ name: 'player1', score: 30}));
            scores.add(new Score({ name: 'mamku', score: 65}));
            scores.add(new Score({ name: 'sosai', score: 35}));
            scores.add(new Score({ name: '4e_ne_4etko', score: 100}));
            scores.add(new Score({ name: 'alala', score: 55}));
            scores.add(new Score({ name: 'paxan', score: 2}));
            scores.add(new Score({ name: 'petuhan', score: 1}));
            scores.add(new Score({ name: 'swag', score: 66}));
            scores.add(new Score({ name: '666kg', score: 3}));
            scores.add(new Score({ name: 'lehi4', score: 78}));

			this.$el.hide();
			$('#page').append(this.render().el);
        },
        render: function () {
            this.$el.html(this.template({scores: scores.toJSON()}));
            return this;
        },
        show: function() {
			this.$el.show();
			this.trigger('show', this);
        },
		hide: function() {
			this.$el.hide();
		}
    });

    return new View();
});
