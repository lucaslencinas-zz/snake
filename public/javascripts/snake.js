'use strict';

var directions = {
	UP: 'UP',
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	DOWN: 'DOWN'
};

var lastTimestamp;

var Snake = {
	boardClass: '.board',
	height: 20,
	width: 30,
	food: {x: 1, y: 1},
	body: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
	snakeDirection: directions.RIGHT,

	init: function(boardClass, height, width) {
		var self = this;
		this.boardClass = boardClass || this.boardClass;
		this.height = height || this.height;
		this.width = width || this.width;
		this.placeSnake(Math.floor(this.width / 5), Math.floor(this.height / 5))
		this.placeFood(Math.floor(this.width * 3 / 5), Math.floor(this.height * 3 / 5))
		this.drawBoard();
		this.drawSnake();
		this.drawFood();
		lastTimestamp = Date.now();
		requestAnimationFrame(self.mainLoop.bind(self));
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
			row = rowSelector(piece.y);
			column = columnSelector(piece.x);
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
		var row = rowSelector(this.food.y);
		var column = columnSelector(this.food.x);
		$(this.boardClass + ' ' + row + ' ' + column ).addClass('food');
	},

	startGame: function() {
		console.log('game started');
	},

	moveSnake: function() {
		var last = this.body.pop();
		$(this.boardClass + ' ' + rowSelector(last.y) + ' ' + columnSelector(last.x)).removeClass('piece');
		var head = Object.assign({}, this.body[0]);
		this.movePiece(head);
		$(this.boardClass + ' ' + rowSelector(head.y) + ' ' + columnSelector(head.x)).addClass('piece');
		this.body.unshift(head);
	},

	movePiece: function(piece) {
		switch (this.snakeDirection) {
			case directions.UP:
				piece.y = piece.y - 1;
			break;
			case directions.RIGHT:
				piece.x = piece.x + 1;
			break;
			case directions.DOWN:
				piece.y = piece.y + 1;
			break;
			case directions.LEFT:
				piece.x = piece.x - 1;
			break;
		}
	},

	animate: function(timestamp) {
		var delta = timestamp - lastTimestamp;
		if(delta > 1000) {
			console.log(delta);
			this.moveSnake();
			lastTimestamp = timestamp;
		}
	},

	mainLoop: function() {
		var timestamp = Date.now();
		var self = this;
    self.animate(timestamp);
    requestAnimationFrame(self.mainLoop.bind(self));
	}
};

// Helper functions...

function rowSelector(y) {
	return '.board-row:nth-child(' + y + ')';
}

function columnSelector(x) {
	return '.position:nth-child(' + x + ')';
}
