define([
    'backbone',
    'tmpl/scoreboard',
    'models/score',
    'collections/scores',
    'views/loading'
], function(
    Backbone,
    tmpl,
    Score,
    scores,
    loadingView
){

    var View = Backbone.View.extend({
        template: tmpl,
        className: 'full_screen_view_container',
        limit: undefined,
        events: {
            'click .menu__overlay__retry_button': 'onRetry'
        },
        initialize: function () {
            /*
            scores.create({ name: 'player1', score: 30});
            scores.create({ name: 'mamku', score: 65});
            scores.create({ name: 'sosai', score: 35});
            scores.create({ name: '4e_ne_4etko', score: 100});
            scores.create({ name: 'alala', score: 55});
            scores.create({ name: 'paxan', score: 2});
            scores.create({ name: 'petuhan', score: 1});
            scores.create({ name: 'swag', score: 66});
            scores.create({ name: '666kg', score: 3});
            scores.create({ name: 'lehi4', score: 78});
            */
			this.$el.hide();
        },
        onSyncError: function(collection, resp, options) {
            this.$el.find('.menu__overlay__title').text('Connection to server failed');
            this.$el.find('.menu__overlay').show(); 
            
        },
        onRetry: function() {
            this.updateView();
        },
        onSync: function() {
            this.render();
            this.$el.find('.menu__overlay').hide();
        },
        updateView: function() {
            this.$el.find('.menu__overlay__title').text('LOADING...');
            this.$el.find('.menu__overlay').show();

            scores.fetch();
        },
        render: function () {
            var scoresBackupJSON = this.getJSON('scoresBackup');

            if (scoresBackupJSON != null) {
                $.each(scoresBackupJSON, function(key, val) {
                    scores.forEach(function(score) {
                        if (score.get('name') == key && score.get('score') == val) {
                            delete scoresBackupJSON[key];
                        }
                    });
                });

                this.setJSON('scoresBackup', scoresBackupJSON);
            }


            if (!this.limit) {
                this.limit = 10;
            }
            
            this.$el.html(this.template({scores: scores.toJSON().slice(0, this.limit)}));

            return this;
        },
        show: function(limit) {
            if (loadingView.loading(this)) {
                return;
            }

            this.limit = limit;

            scores.on('sync', this.onSync, this);
            scores.on('error', this.onSyncError, this);

			this.$el.show();
			this.trigger('show', this);

            var scoresBackupJSON = this.getJSON('scoresBackup');

            if (scoresBackupJSON != null) {
                $.each(scoresBackupJSON, function(key, val) {
                    scores.create({ name: key, score: val });
                });                
            }

            this.updateView();
        },
		hide: function() {
            scores.off('sync', this.onSync);
            scores.off('error', this.onSyncError);

			this.$el.hide();
		},
        setJSON: function(key, value) {
            localStorage[key] = JSON.stringify(value);
        },
        getJSON: function(key) {
            var value = localStorage[key];
            return value ? JSON.parse(value) : null;
        },
    });

    return new View();
});
