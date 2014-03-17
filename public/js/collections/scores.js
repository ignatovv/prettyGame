define([
    'backbone',
    'models/score'
], function(
    Backbone,
    Score
){

    var Collection = Backbone.Collection.extend({
        model: Score,
        url: '/scores/',
        comparator: function(obj) {
            return -obj.get("score");
        }
    });

    return new Collection();
});
