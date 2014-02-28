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
            $('.menu__sound_button').on('click', this.switchSound);
        },
        switchSound: function() {
            var muscController =  $('.background__music').get(0);
            if(muscController.paused) {
                muscController.currentTime = 0;
                muscController.play();
            } else {
                muscController.pause();
            }
        }
                                        
    });

    return new MainView();
});
