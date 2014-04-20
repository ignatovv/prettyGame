define([
	'backbone'
], function(
	Backbone
){
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	var SoundFactory = Backbone.Model.extend({
		ctx: null,
		soundBuffers: {},
		musicSource: null,
		soundsLoaded: 0,
		soundsTotal: 0,
		initialize: function () {
			this.set('status', !localStorage['sound'] || localStorage['sound'] == 'on');
			this.initializeSound('blast_shoot.wav');
			this.initializeSound('player_shoot.wav');
			this.initializeSound('explosion.wav');
			this.initializeSound('explosion2.wav');
			this.initializeSound('hit.wav');
			this.initializeSound('powerup.wav');
			this.initializeSound('background.mp3');
			this.on('change:status', this.onStatusChanged);
			
			if (window.AudioContext) {
				this.ctx = new AudioContext();
			}
		},
		initializeSound: function(filename) {
			var request = new XMLHttpRequest();
			var soundFactory = this;
			var url = '/sounds/' + filename;

			++this.soundsTotal;

			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			request.onload = function() {
				soundFactory.ctx.decodeAudioData(request.response, function(buffer) {
					soundFactory.soundBuffers[filename] = buffer;
					++soundFactory.soundsLoaded;
					soundFactory.onSoundLoaded();
				}, function() {
					console.error('Sound file ' + url + ' cant be loaded');
				});
			};

			request.send();
		},
		play: function(filename, delay) {
			if (!this.soundBuffers[filename]) {
				console.error('Sound ' + filename + ' was not loaded');
				return null;
			}

			if (!this.get('status')) {
				return null;
			}

			var source = this.ctx.createBufferSource();

			if (!delay) {
				delay = 0;
			}

			source.buffer = this.soundBuffers[filename];
			source.connect(this.ctx.destination);

			source.start(delay);

			return source;
		},
		playSound: function(filename, delay) {
			this.play(filename, delay);
		},
		playMusic: function(filename) {
			var source = this.play(filename);

			if (source) {
				source.loop = 'true';
				this.musicSource = source;
			}
        },
        stopMusic: function(filename) {
        	if (this.musicSource) {
				this.musicSource.stop();
				this.musicSource = null;
			}
        },
		playBlastShoot: function() {
			this.playSound('blast_shoot.wav');
		},
		playPlayerShoot: function(delay) {
			this.playSound('player_shoot.wav', delay);
		},
		playExplosion: function() {
			this.playSound('explosion.wav');
		},
		playExplosion2: function() {
			this.playSound('explosion2.wav');
		},
		playHit: function() {
			this.playSound('hit.wav');
		},
		playPowerUp: function() {
			this.playSound('powerup.wav');
		},
		playBackgroundMusic: function() {
			this.playMusic('background.mp3');
        },
        stopBackgroundMusic: function() {
            this.stopMusic('background.mp3');
        },
        onStatusChanged: function() {
			localStorage['sound'] = (this.get('status')) ? 'on' : 'off';
		},
		onSoundLoaded: function() {
			this.trigger('sound_loaded');
		},
		isSoundsLoaded: function() {
			return this.soundsLoaded == this.soundsTotal;
		}
	});

	return SoundFactory;
});