define([
    'backbone',
    'tmpl/gameover',
    'models/gamelogic',
    'models/score',
    'collections/scores'
], function(
    Backbone,
    tmpl,
    gamelogic,
    Score, 
    scores
){

    var View = Backbone.View.extend({
        template: tmpl,
        events: {
            "click .gameover__submit": "submitScore"
        },
        initialize: function () {
			this.$el.hide();
        },
        render: function () {
            this.$el.html(this.template());
            return this;
        },
        show: function() {
            scores.on('sync', this.onScoreSubmitSync, this);
            scores.on('error', this.onScoreSubmitError, this);

            this.$el.find(".score").text(gamelogic.scores);
			this.$el.show();
        },
		hide: function() {
            scores.off('sync', this.onScoreSubmitSync);
            scores.off('error', this.onScoreSubmitError);

			this.$el.hide();
		},
        setInputsEnabled: function(value) {
            if (value) {
                this.$el.find('.gameover__name').removeAttr('disabled');
                this.$el.find('.gameover__submit').removeAttr('disabled');
            } else {
                this.$el.find('.gameover__name').attr('disabled', 'disabled');
                this.$el.find('.gameover__submit').attr('disabled', 'disabled');
            }
        },
        submitScore: function() {
            var name = this.$el.find('.gameover__name').val();
            var currentScore = gamelogic.scores;

            if (!name) {
                alert('Incorrect name');
                return;
            }

            if (!currentScore) {
                alert('Incorrect score');
                return;
            }

            this.setInputsEnabled(false);
            scores.create({ name: this.$el.find('.gameover__name').val(), score: gamelogic.scores});
        },
        setJSON: function(key, value) {
            localStorage[key] = JSON.stringify(value);
        },
        getJSON: function(key) {
            var value = localStorage[key];
            return value ? JSON.parse(value) : null;
        },
        onScoreSubmitError: function(collection, resp, options) {
            var name = this.$el.find('.gameover__name').val();
            var currentScore = gamelogic.scores;

            this.setInputsEnabled(true);

            alert('Score sending failed');

            var scoresBackupJSON = this.getJSON('scoresBackup');

            if (scoresBackupJSON == null) {
                scoresBackupJSON = {};
            }

            if (!scoresBackupJSON[name] || scoresBackupJSON[name] < currentScore) {
               scoresBackupJSON[name] = currentScore;
            }

            this.setJSON('scoresBackup', scoresBackupJSON);
        },
        onScoreSubmitSync: function() {
            this.setInputsEnabled(true);

            location.href = "#scoreboard";
        }
    });
    return new View();
});
