define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
){

    var MainView = Backbone.View.extend({	
        template: tmpl,
        initialize: function () {
        },
        render: function () {
            $(this.el).html(this.template());
            return this;
        },
        show: function(){
            $('#page').html(this.render().el);
        }
    });

    return new MainView();
});
