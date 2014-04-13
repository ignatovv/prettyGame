define([
    'backbone',
    'models/game_models/explosion_unit'
], function(
    Backbone,
    explosion
){

    var Collection = Backbone.Collection.extend({
        model: explosion
    });
    return new Collection();
});
