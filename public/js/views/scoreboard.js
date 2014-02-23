define([
    'backbone',
    'tmpl/scoreboard',
    'models/score'
], function(
    Backbone,
    tmpl,
    Score
){
    var View = Backbone.View.extend({

        template: tmpl,
        initialize: function () {
            // TODO
        },
        render: function () {
            $(this.el).html(this.template());
            
            var Scores = Backbone.Collection.extend({
                model: Score
            });
            
            var scores = new Scores();
            
            scores.add(new Score({ name: 'player1', score: 30}));
            scores.add(new Score({ name: 'mamku', score: 55}));
            scores.add(new Score({ name: 'sosai', score: 35}));
            scores.add(new Score({ name: '4e_ne_4etko', score: 100}));
            scores.add(new Score({ name: 'alala', score: 65}));
            scores.add(new Score({ name: 'paxan', score: 101}));
            scores.add(new Score({ name: 'petuhan', score: 1}));
            scores.add(new Score({ name: 'swag', score: 66}));
            scores.add(new Score({ name: '666kg', score: 3}));
            scores.add(new Score({ name: 'lehi4', score: 78}));

            scores.comparator = function(obj) {
                return -obj.get("score");
            };
            
            scores.sort();

            scores.forEach(function(obj) {
                var scoreContents = '<b>' + obj.get('name') + '</b> ' + obj.get('score');
                var scoreElement = $('<div>').addClass('scoreboard__score').html(scoreContents);
                $(this.el).find(".scoreboard").append(scoreElement);
            }, this);
            
            return this;
        },
        show: function () {
            // TODO
        },
        hide: function () {
            // TODO
        }

    });

    return new View();
});
