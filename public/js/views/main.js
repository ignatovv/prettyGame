define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
){
    var MainView = Backbone.View.extend({
	
        className: "main_view",
        template: tmpl,
        initialize: function () {
            //this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            $(this.el).html(this.template());
            return this;
        },
        show: function () {
            // TODO
        },
        hide: function () {
            // TODO
        }

    });

    return new MainView();
});