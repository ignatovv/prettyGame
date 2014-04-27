define([
    'Connector',
    'models/gamelogic'
], function(
    Connector,
    gamelogic
){
	var GameServer = Backbone.Model.extend({
		server: new Connector({
			server: ['getToken', 'bind'],
			remote: '/console'
		}),
		initialize: function () {
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
		init: function(){
			if (!localStorage.getItem('consoleguid')){
				server.getToken(function(token){
					console.log('token: ' + token);
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
				if (data.status == 'success'){
					gs.start(data.guid);
				} else if (data.status == 'undefined guid'){
					localStorage.removeItem('consoleguid');
					gs.init();
				}
			});
		},

		handleMessage: function(message) {

            switch(message) {
            	case "FIRE": gamelogic.spacebarButtonPressed = true; break;
            	case "STOP_FIRE": gamelogic.spacebarButtonPressed = false; break;
            	case "MOVE_RIGHT": gamelogic.rightButtonPressed = true; break;
            	case "MOVE_LEFT": gamelogic.leftButtonPressed = true; break;
            	case "STOP": 
            		gamelogic.rightButtonPressed = false; 
            		gamelogic.leftButtonPressed = false;
            		break;
            }
		}


	});

	return new GameServer();
});