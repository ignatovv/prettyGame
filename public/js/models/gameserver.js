define([
    'Connector'
], function(
    Connector
){
	var GameServer = Backbone.Model.extend({
		server: new Connector({
			server: ['getToken', 'bind'],
			remote: '/console'
		}),
		initialize: function (gamelogic) {
			this.gamelogic = gamelogic;

			gs = this;
			this.server.on('player-joined', function(data){
				gs.start(data.guid);
			});

			this.server.on('reconnect', this.reconnect);

			this.server.on('message', function(data, answer){
				//console.log('message', data);
				//answer('answer');
				gs.handleMessage(data);
			});
			window.server = this.server;
			this.init();
		},
		init: function() {
			if (!localStorage.getItem('consoleguid')) {
				server.getToken(function(token) {
					gs.gamelogic.trigger('token_generated', token);
				});
			} else {
				this.reconnect();
			}
		},
		start: function(guid){
			console.log('start game');
			localStorage.setItem('consoleguid', guid);
		},
		reconnect: function(){
			gs = this;
			server.bind({guid: localStorage.getItem('consoleguid')}, function(data){
				if (data.status == 'success') {
					gs.start(data.guid);
				} else if (data.status == 'undefined guid'){
					localStorage.removeItem('consoleguid');
					gs.init();
				}
			});
		},
		handleMessage: function(message) {
			var parsed = JSON.parse(message);

			if (parsed) {
				switch (parsed.action) {
	            	case "fire":
	            		this.gamelogic.spacebarButtonPressed = true;
	            		break;
	            	case "stop_fire":
	            		this.gamelogic.spacebarButtonPressed = false;
	            		break;
        			case "tilt":
        				this.gamelogic.tilt = parsed.value;
	            		break;
	            	case "MOVE_RIGHT":
	            		this.gamelogic.rightButtonPressed = true;
	            		break;
	            	case "MOVE_LEFT":
	            		this.gamelogic.leftButtonPressed = true;
	            		break;
	            	case "STOP": 
	            		this.gamelogic.rightButtonPressed = false; 
	            		this.gamelogic.leftButtonPressed = false;
	            		break;
	            }				
			}
		}
	});

	return GameServer;
});