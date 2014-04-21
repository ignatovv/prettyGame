define([
    'backbone',
    'tmpl/loading',
    'models/gamelogic'
], function(
    Backbone,
    tmpl,
    gamelogic
){

    var View = Backbone.View.extend({	
        loaded: false,
        parentView: null,
        template: tmpl,
		initialize: function () {
			this.$el.hide();
            gamelogic.soundFactory.on('sound_progress_changed', this.onSoundProgressChanged, this);
            gamelogic.soundFactory.on('sound_loaded', this.onSoundLoaded, this);
        },
        render: function () {
            this.$el.html(this.template());
            
            return this;
        },
        loading: function(parentView) {
            if (this.loaded) {
                return false;
            }

            this.show(parentView);

            return true;
        },
        show: function (parentView) {
            this.parentView = parentView;
			this.$el.show();
			this.trigger('show', this);
        },
        showParent: function() {
            this.parentView.show();
            this.parentView = null;
        },
        hide: function() {
            this.$el.hide();
		},
        updateProgess: function(loadedBytes, totalBytes) {
            var current = gamelogic.soundFactory.soundsLoaded;
            var total = gamelogic.soundFactory.soundsTotal;

            if (loadedBytes && totalBytes) {
                current += loadedBytes / totalBytes;
            }

            var progress = 100 * current / total;

            this.$el.find(".loading__progress").text(Math.floor(progress) + '%');
        },
        onSoundProgressChanged: function(loadedBytes, totalBytes) {
            this.updateProgess(loadedBytes, totalBytes);
        },
        onSoundLoaded: function(loaded, total) {
            this.updateProgess();

            if (gamelogic.soundFactory.isSoundsLoaded()) {
                this.loaded = true;

                gamelogic.soundFactory.off('sound_loaded', this.onSoundLoaded);
                gamelogic.soundFactory.off('sound_progress_changed', this.onSoundProgressChanged);

                if (this.parentView) {
                    this.showParent();
                }
            }
        }
    });

    return new View();
});