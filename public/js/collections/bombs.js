define([
    'backbone',
    'models/game_models/bomb_unit'
], function(
    Backbone,
    bomb
){

    var Collection = Backbone.Collection.extend({
        model: bomb  
    });
    return new Collection();
});
