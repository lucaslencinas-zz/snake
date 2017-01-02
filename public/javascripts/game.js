'use strict';

/* Class Game */

var Game = function(config) {
	Object.assign(this, config);

	this.snake 	= new SnakeGame(config);
	this.socket = new Socket(config, this.snake);
}

Game.prototype.keyDown = function(keyCode) {
  this.snake.keyDown(keyCode);
}

Game.prototype.startGame = function() {
	this.snake.startGame();
	this.socket.startGame();
}

Game.prototype.endGame = function() {
	this.snake.endGame();
}
