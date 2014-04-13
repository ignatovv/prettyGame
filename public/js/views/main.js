define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({	
        template: tmpl,
        className: 'full_screen_view_container',
		events: {
			"click .menu__sound_button": "switchSound"
		},
        initialize: function () {
			this.$el.hide();

            if (!localStorage['sound'] || localStorage['sound'] == 'on') {
                this.switchSound();
            }
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
            var musicElement = $('.background__music').get(0);

            if (!localStorage['sound'] || localStorage['sound'] == 'on') {
                localStorage['sound'] = 'off';
            } else {
                localStorage['sound'] = 'on';
            }
        }
                                        
    });

    return new View();
});
