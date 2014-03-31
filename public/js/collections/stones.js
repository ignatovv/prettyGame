define([
    'backbone',
    'models/game_models/stone_unit'
], function(
    Backbone,
    stone
){

    var Collection = Backbone.Collection.extend({
        model: stone  
    });
    return new Collection();
});
