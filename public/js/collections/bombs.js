define([
    'backbone',
    'models/game_models/game_model'
], function(
    Backbone,
    bomb
){

    var Collection = Backbone.Collection.extend({
        model: bomb  
    });
    return new Collection();
});
