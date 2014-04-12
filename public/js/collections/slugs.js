define([
    'backbone',
    'models/game_models/slug_unit'
], function(
    Backbone,
    slug
){

    var Collection = Backbone.Collection.extend({
        model: slug 
    });
    return new Collection();
});
