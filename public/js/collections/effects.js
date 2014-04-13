define([
    'backbone',
    'models/game_models/game_model'
], function(
    Backbone,
    gameModel
){

    var Collection = Backbone.Collection.extend({
        model: gameModel  
    });
    
    return new Collection();
});
