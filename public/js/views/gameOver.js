define([
    'backbone',
    'tmpl/gameOver',
    'models/gamelogic'
], function(
    Backbone,
    tmpl,
    gamelogic
){

    var View = Backbone.View.extend({
        template: tmpl,
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
			this.trigger('show', this);
        },
		hide: function() {
			this.$el.hide();
		}
    });

    return new View();
});
