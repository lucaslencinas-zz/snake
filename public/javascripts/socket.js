'use strict';

/* Class Socket */

var Socket = function(config, snake) {
	Object.assign(this, config);

	this.snake 	= snake;
  this.init();
}

Socket.prototype.init = function() {
	var self = this;
  var params = encodeQueryData({room: this.room, pass: this.pass, amountOfPlayers: this.amountOfPlayers});
  this.socket = io.connect('http://localhost:3000', { query: params, 'force new connection': true });


  /* --- Handle actions received --- */

  this.socket.on('user-connected', function(data){
    console.log('user-connected: ' + JSON.stringify(data));
    self.assignSpot(data.player);
  });

  this.socket.on('user-disconnected', function(data){
    console.log('user-disconnected: ' + JSON.stringify(data));
    self.unassignSpot(data.player);
    if (this.snake.gameStarted) {
      this.snake.handleDeath();
    }
  });

  this.socket.on('current-players', function(data){
    data.players.forEach(function(player,index) {
      self.assignSpot(player);
    });
  });

  this.socket.on('button-clicked', function(data){
    console.log('button-clicked: ' + JSON.stringify(data));
    self.buttonClicked(data.button);
  });
}

Socket.prototype.startGame = function() {
  this.socket.emit('game-started', {});
};

Socket.prototype.assignSpot = function(player) {
  var button = this.buttons.find(isNotSet);
	if(button === undefined) {
		console.log('No se encontro un button para assignar');
	} else {
		$('#' + button.id).css( "background-color", player.color );
		$('#' + button.id).text($('#' + button.id).text() + ' - ' + player.name);
		$('#' + button.id).data( "playerId", player.id );
		button.set = true;
		button.playerId = player.id;
		var playersLeft = parseInt($("#amountOfPlayers").text()) -1;
		$("#amountOfPlayers").text(playersLeft);
		if(playersLeft == 0) {
			$('#startGame').removeAttr("disabled");
		}
		player.spot = button;
		this.socket.emit('spot-assigned', player);
	}
}

Socket.prototype.unassignSpot = function(player) {
  var button = this.buttons.find(function(b){
    return b.playerId === player.id;
  });
  $('#' + button.id).removeData( "playerId" );
  $('#' + button.id).css( "background-color", "wheat" );
  $('#' + button.id).text($('#' + button.id).text().split(' - ')[0]);
  button.set = false;
  button.playerId = undefined;
  var playersLeft = parseInt($("#amountOfPlayers").text()) + 1;
  $("#amountOfPlayers").text(playersLeft);
}

Socket.prototype.buttonClicked = function (data) {
  var button = this.buttons.find(function(b){
    return b.id === data;
  });
  this.snake.nextDirection  = this.directionKeyCodes[button.keyCode];
}

function isNotSet(button) {
  return button.set === false;
}
