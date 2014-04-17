define([
	'backbone'
], function(
	Backbone
){
	var SoundFactory = Backbone.Model.extend({
		sounds: { },
		music: { },
		initialize: function () {
			this.set('status', !localStorage['sound'] || localStorage['sound'] == 'on');
			this.initializeSound('blast_shoot.wav', 1);
			this.initializeSound('player_shoot.wav', 10);
			this.initializeSound('player_triple_shoot.wav', 10);
			this.initializeSound('explosion.wav', 1);
			this.initializeSound('explosion2.wav', 10);
			this.initializeSound('hit.wav', 10);
			this.initializeSound('powerup.wav', 1);
			this.initializeMusic('background.mp3');
			this.on('change:status', this.onStatusChanged);
		},
		initializeSound: function(filename, count) {
			this.sounds[filename] = { sounds: [], index: 0 };

			for (var i = 0; i < count; ++i) {
				this.sounds[filename].sounds.push(new Audio('/sounds/' + filename));
			}
		},
		initializeMusic: function(filename) {
			this.music[filename] = new Audio('/music/' + filename);
			this.music[filename].volume = 0.6;
			this.music[filename].loop = true;
		},
		playSound: function(filename) {
			if (!this.get('status')) {
				return;
			}

			this.sounds[filename].sounds[this.sounds[filename].index++].play();

			if (this.sounds[filename].index >= this.sounds[filename].sounds.length) {
				this.sounds[filename].index = 0;
			}
		},
		playMusic: function(filename) {
			if (!this.get('status')) {
				return;
			}

            this.music[filename].play();
        },
        stopMusic: function(filename) {
			if (!this.get('status')) {
				return;
			}

            this.music[filename].currentTime = 0;
            this.music[filename].pause();
        },
		playBlastShoot: function() {
			this.playSound('blast_shoot.wav');
		},
		playPlayerShoot: function() {
			this.playSound('player_shoot.wav');
		},
		playPlayerTripleShoot: function() {
			this.playSound('player_triple_shoot.wav');
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
		}
	});

	return SoundFactory;
});