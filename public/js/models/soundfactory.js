define([
	'backbone'
], function(
	Backbone
){
	var SoundFactory = Backbone.Model.extend({
		sounds: {},
		initialize: function () {
			this.initializeSound('blast_shoot.wav', 1);
			this.initializeSound('player_shoot.wav', 10);
			this.initializeSound('player_triple_shoot.wav', 10);
			this.initializeSound('explosion.wav', 1);
			this.initializeSound('explosion2.wav', 10);
			this.initializeSound('hit.wav', 10);
			this.initializeSound('powerup.wav', 1);
		},
		initializeSound: function(filename, count) {
			this.sounds[filename] = { sounds: [], index: 0 };

			for (var i = 0; i < count; ++i) {
				this.sounds[filename].sounds.push(new Audio('/sounds/' + filename));
			}
		},
		playSound: function(filename) {
			this.sounds[filename].sounds[this.sounds[filename].index++].play();

			if (this.sounds[filename].index >= this.sounds[filename].sounds.length) {
				this.sounds[filename].index = 0;
			}
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
		}
	});

	return SoundFactory;
});