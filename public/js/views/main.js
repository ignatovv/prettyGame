define([
    'backbone',
    'tmpl/main',
    'models/gamelogic'
], function(
    Backbone,
    tmpl,
    gamelogic
){

    var View = Backbone.View.extend({	
        template: tmpl,
        className: 'full_screen_view_container',
		events: {
			"click .menu__sound_button": "switchSound"
		},
        initialize: function () {
			this.$el.hide();
        },
        render: function () {
            this.$el.html(this.template());
            return this;
        },
        show: function() {
			this.$el.show();
			this.trigger('show', this);
        },
		hide: function() {
			this.$el.hide();
		},
        switchSound: function() {
            gamelogic.soundFactory.set('status', !gamelogic.soundFactory.get('status'));
        }
    });

    return new View();
});
