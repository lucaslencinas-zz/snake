'use strict';

var directions = {
	UP: 'UP',
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	DOWN: 'DOWN'
};

var oppositeDirections = {
	UP: directions.DOWN,
	LEFT: directions.RIGHT,
	RIGHT: directions.LEFT,
	DOWN: directions.UP
};

/* Class Snake */

var SnakeGame = function(config) {
	Object.assign(this, config);
	this.lastTimestamp = undefined;
	this.animationFrameId = undefined;
	this.firstTry = true;
	this.gameStarted = false;
	this.drawBoard();
	this.setDefaultComponents();
}

SnakeGame.prototype.setDefaultComponents = function() {
	this.snakeDirection = directions.RIGHT;
	this.nextDirection = directions.RIGHT;
	this.timeBeetwenFrames = 1500;
	this.food = {x: 1, y: 1};
	this.body = [{ x: 5, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }];
	this.placeSnake(Math.floor(this.board.width / 5), Math.floor(this.board.height / 5));
	this.placeFood(Math.floor(this.board.width * 3 / 5), Math.floor(this.board.height * 3 / 5));
	this.drawSnake();
	this.drawFood();
	$(this.teamSelector + ' .score span').text(0);
}

SnakeGame.prototype.drawBoard = function() {
	for(var row = 0; row < this.board.height; row++ ){
		$(this.board.selector).append('<div class="board-row">');
		for(var column = 0; column < this.board.width; column++ ){
			$(this.board.selector + ' .board-row:last-child').append('<div class="position">');
		}
	}
}

SnakeGame.prototype.cleanBoard = function() {
	var $position;
	for(var row = 1; row <= this.board.height; row++ ){
		for(var column = 1; column <= this.board.width; column++ ){
			$position = $(this.board.selector + ' ' + rowSelector(row) + ' ' + columnSelector(column));
			if ($position.hasClass('piece'))
				$position.toggleClass('piece');
			if ($position.hasClass('food'))
				$position.toggleClass('food');
		}
	}
}

SnakeGame.prototype.drawSnake = function() {
	var self = this;
	this.body.forEach(function(piece, index, body){
		$(self.board.selector + ' ' + rowSelector(piece.y) + ' ' + columnSelector(piece.x)).addClass('piece');
	});
}

SnakeGame.prototype.placeSnake = function(x, y) {
	this.body.forEach(function(piece, index, body){
		piece.x += x;
		piece.y += y;
	});
}

SnakeGame.prototype.placeFood = function(x, y) {
	this.food.x += x;
	this.food.y += y;
}

SnakeGame.prototype.drawFood = function() {
	$(this.board.selector + ' ' + rowSelector(this.food.y) + ' ' + columnSelector(this.food.x)).addClass('food');
}

	SnakeGame.prototype.startGame = function() {
		if(this.firstTry) {
			this.firstTry = false;
		} else {
			$('.message').css('visibility', 'hidden');
			this.cleanBoard();
			this.setDefaultComponents();
		}
		this.gameStarted = true;
		var self = this;
		this.lastTimestamp = Date.now();
		this.animationFrameId = requestAnimationFrame(self.mainLoop.bind(self));
		$("#startGame").prop('disabled', true);
	},

SnakeGame.prototype.moveSnake = function() {
	var last = this.body.pop();
	$(this.board.selector + ' ' + rowSelector(last.y) + ' ' + columnSelector(last.x)).removeClass('piece');
	var head = Object.assign({}, this.body[0]);
	if(!isSameOrOppositeDirection(this.snakeDirection, this.nextDirection)) {
		this.snakeDirection = this.nextDirection;
	}
	this.movePiece(head);
	$(this.board.selector + ' ' + rowSelector(head.y) + ' ' + columnSelector(head.x)).addClass('piece');
	this.body.unshift(head);
	if(this.isOverFoodPosition()) {
		this.eatFood(last);
		this.increaseScore();
		this.increaseSpeed();
		this.createMoreFood();
	}
	if(this.isOverMyself() || this.isOutOfBoard()) {
		this.handleDeath();
	}
}

SnakeGame.prototype.increaseScore = function() {
	$(this.teamSelector + ' .score span').text(parseInt($(this.teamSelector + ' .score span').text()) + 10);
}

SnakeGame.prototype.increaseSpeed = function() {
	console.log(this.timeBeetwenFrames);
	this.timeBeetwenFrames-= this.getDecrementValue();
}


SnakeGame.prototype.getDecrementValue = function() {
	// like an hiperbole with asintotes in the 50 points
	var t = this.timeBeetwenFrames;
	if(t > 150)
		return 5;
	if(t > 125)
		return 4;
	if(t > 100)
		return 3;
	if(t > 75)
		return 2;
	if(t > 50)
		return 1;
	return Math.round(Math.random());
}

SnakeGame.prototype.isOverMyself = function() {
	var tail = this.body.slice(1,this.body.length);
	var head = this.body[0];
	return tail.some(function(piece, index, array) {
			return samePosition(head, piece);
		}
	);
}

SnakeGame.prototype.isOutOfBoard = function() {
	var outOfWidth = this.body[0].x > this.board.width || this.body[0].x < 1;
	var outOfHeight = this.body[0].y > this.board.height || this.body[0].y < 1;
	return outOfHeight || outOfWidth;
}

SnakeGame.prototype.handleDeath = function() {
	this.endGame();
	this.roomHandler.handleDeath(this.teamSelector);
}

SnakeGame.prototype.endGame = function() {
	this.gameStarted = false;
	if (this.animationFrameId) {
		cancelAnimationFrame(this.animationFrameId);
		this.animationFrameId = undefined;
	}
}

SnakeGame.prototype.movePiece = function(piece) {
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
}

SnakeGame.prototype.animate = function(timestamp) {
	if(this.board.selector === '.team2')
		console.log(this.board.selector);
	var delta = timestamp - this.lastTimestamp;
	if(delta > this.timeBeetwenFrames) {
		this.moveSnake();
		this.lastTimestamp = timestamp;
	}
}

SnakeGame.prototype.mainLoop = function() {
	if(this.animationFrameId) {
		var timestamp = Date.now();
		var self = this;
		self.animate(timestamp);
		requestAnimationFrame(self.mainLoop.bind(self));
	}
}

SnakeGame.prototype.keyDown = function(keyCode) {
	if(this.gameStarted && this.isValidKeyCode(keyCode)) {
		this.nextDirection  = this.directionKeyCodes[keyCode];
	}
}

SnakeGame.prototype.isValidKeyCode = function(code) {
		/*TODO Fix this, is horrible!!! */
		if(this.teamSelector === '.team2')
			return code < 41 && code > 36;
		if(this.teamSelector === '.team1' && code === 65)
			return true;
		if(this.teamSelector === '.team1' && code === 83)
			return true;
		if(this.teamSelector === '.team1' && code === 68)
			return true;
		if(this.teamSelector === '.team1' && code === 87)
			return true;
		return false;
	}

SnakeGame.prototype.isOverFoodPosition = function() {
	return samePosition(this.body[0], this.food);
}

SnakeGame.prototype.eatFood = function(lastPiece) {
	$(this.board.selector + ' ' + rowSelector(lastPiece.y) + ' ' + columnSelector(lastPiece.x)).addClass('piece');
	this.body.push(lastPiece);
	$(this.board.selector + ' ' + rowSelector(this.food.y) + ' ' + columnSelector(this.food.x)).removeClass('food');
}

SnakeGame.prototype.createMoreFood = function() {
	this.food = this.randomAvailablePosition();
	this.drawFood();
}

SnakeGame.prototype.randomAvailablePosition = function() {
	var position = randomPosition(this.board.width, this.board.height);
	while(!this.availablePosition(position)) {
		position = randomPosition(this.board.width, this.board.height);
	}
	return position;
}

SnakeGame.prototype.availablePosition = function(position) {
	return this.body.every(function(piece, index, body) {
			return !samePosition(position, piece);
		}
	);
}

// Helper functions...

function rowSelector(y) {
	return '.board-row:nth-child(' + y + ')';
}

function columnSelector(x) {
	return '.position:nth-child(' + x + ')';
}

function isSameOrOppositeDirection(oneDirection, anotherDirection) {
	return oneDirection === anotherDirection || oppositeDirections[oneDirection] === anotherDirection;
}

function randomPosition(xMax, yMax) {
	var x = Math.ceil(Math.random() * xMax);
	var y = Math.ceil(Math.random() * yMax);
	return { x: x, y: y };
}

function samePosition(pos1, pos2) {
	return pos1.x === pos2.x && pos1.y === pos2.y;
}
