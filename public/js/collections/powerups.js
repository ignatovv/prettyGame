define([
    'backbone',
    'models/game_models/powerup_unit'
], function(
    Backbone,
    powerup
){

    var Collection = Backbone.Collection.extend({
        model: powerup  
    });
    return new Collection();
});
