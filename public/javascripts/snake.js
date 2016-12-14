'use strict';

var directions = {
	UP: 'UP',
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	DOWN: 'DOWN'
};

var Snake = {
	boardClass: '.board',
	height: 20,
	width: 30,
	food: {x: 1, y: 1},
	body: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }],
	initialSnakeDirection: directions.RIGHT,

	init: function(boardClass, height, width) {
		var that = this;
		this.boardClass = boardClass || this.boardClass;
		this.height = height || this.height;
		this.width = width || this.width;
		this.placeSnake(Math.floor(this.width / 5), Math.floor(this.height / 5))
		this.placeFood(Math.floor(this.width * 3 / 5), Math.floor(this.height * 3 / 5))
		this.drawBoard();
		this.drawSnake();
		this.drawFood();
	},

	drawBoard: function() {
		for(var row = 0; row < this.height; row++ ){
			$(this.boardClass).append('<div class="board-row">');
			for(var column = 0; column < this.width; column++ ){
				$(this.boardClass + ' .board-row:last-child').append('<div class="position">');
			}
		}
	},

	drawSnake: function() {
		var row, column;
		var self = this;
		this.body.forEach(function(piece, index, body){
			row = '.board-row:nth-child(' + piece.y + ')';
			column = '.position:nth-child(' + piece.x + ')';
			$(self.boardClass + ' ' + row + ' ' + column ).addClass('piece');
		});
	},

	placeSnake: function(x, y) {
		this.body.forEach(function(piece, index, body){
			piece.x += x;
			piece.y += y;
		});
	},

	placeFood: function(x, y) {
		this.food.x += x;
		this.food.y += y;
	},

	drawFood: function() {
		var row = '.board-row:nth-child(' + this.food.y + ')';
		var column = '.position:nth-child(' + this.food.x + ')';
		$(this.boardClass + ' ' + row + ' ' + column ).addClass('food');
	},

	startGame: function() {
		console.log('game started');
	}
};
