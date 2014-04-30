define([
    'backbone',
    'models/game_models/enemy_unit'
], function(
    Backbone,
    enemy
){

    var Collection = Backbone.Collection.extend({
        model: enemy 
    });
    return new Collection();
});
