define([
    'backbone',
    'tmpl/main',
    'models/gamelogic',
    'views/loading'
], function(
    Backbone,
    tmpl,
    gamelogic,
    loadingView
){

    var View = Backbone.View.extend({	
        template: tmpl,
        className: 'full_screen_view_container',
		events: {
			"click .menu__sound_button": "switchSound"
		},
        initialize: function () {
			this.$el.hide();
            gamelogic.on('token_generated', this.onTokenGenerated, this);
        },
        render: function () {
            this.$el.html(this.template());
            return this;
        },
        show: function() {
            if (loadingView.loading(this)) {
                return;
            }

			this.$el.show();
			this.trigger('show', this);
        },
		hide: function() {
			this.$el.hide();
		},
        switchSound: function() {
            gamelogic.soundFactory.set('status', !gamelogic.soundFactory.get('status'));
        },
        onTokenGenerated: function(token) {
            this.$el.find(".menu__token").text(token);
            this.$el.find(".menu__top_tip").show();
        }
    });

    return new View();
});
