define([
    'backbone',
    'tmpl/notsupported'
], function(
    Backbone,
    tmpl
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
        show: function () {
			this.$el.show();
			this.trigger('show', this);            
        },
        hide: function() {
            this.$el.hide();
		}
    });

    return new View();
});