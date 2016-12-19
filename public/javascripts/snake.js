'use strict';

var directions = {
	UP: 'UP',
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	DOWN: 'DOWN'
};

var directionKeyCodes = {
	37: directions.LEFT,
	38: directions.UP,
	39: directions.RIGHT,
	40: directions.DOWN
};

var oppositeDirections = {
	UP: directions.DOWN,
	LEFT: directions.RIGHT,
	RIGHT: directions.LEFT,
	DOWN: directions.UP
};

var lastTimestamp;
var animationFrameId;
var firstTry = true;

var Snake = {
	boardClass: '.board',
	height: 20,
	width: 30,
	gameStarted: false,

	init: function(boardClass, height, width) {
		this.boardClass = boardClass || this.boardClass;
		this.height = height || this.height;
		this.width = width || this.width;
		this.drawBoard();
		this.setDefaultComponents();
		this.setActionListeners();
	},

	setDefaultComponents: function() {
		this.snakeDirection = directions.RIGHT;
		this.nextDirection = directions.RIGHT;
		this.timeBeetwenFrames = 200;
		this.food = {x: 1, y: 1};
		this.body = [{ x: 5, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }];
		this.placeSnake(Math.floor(this.width / 5), Math.floor(this.height / 5));
		this.placeFood(Math.floor(this.width * 3 / 5), Math.floor(this.height * 3 / 5));
		this.drawSnake();
		this.drawFood();
		$('.score span').text(0);
	},

	drawBoard: function() {
		for(var row = 0; row < this.height; row++ ){
			$(this.boardClass).append('<div class="board-row">');
			for(var column = 0; column < this.width; column++ ){
				$(this.boardClass + ' .board-row:last-child').append('<div class="position">');
			}
		}
	},

	cleanBoard: function() {
		var $position;
		for(var row = 1; row <= this.height; row++ ){
			for(var column = 1; column <= this.width; column++ ){
				$position = $(this.boardClass + ' ' + rowSelector(row) + ' ' + columnSelector(column));
				if ($position.hasClass('piece'))
					$position.toggleClass('piece');
				if ($position.hasClass('food'))
					$position.toggleClass('food');
			}
		}
	},

	drawSnake: function() {
		var self = this;
		this.body.forEach(function(piece, index, body){
			$(self.boardClass + ' ' + rowSelector(piece.y) + ' ' + columnSelector(piece.x)).addClass('piece');
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
		$(this.boardClass + ' ' + rowSelector(this.food.y) + ' ' + columnSelector(this.food.x)).addClass('food');
	},

	startGame: function() {
		if(firstTry) {
			firstTry = false;
		} else {
			$('.message').css('visibility', 'hidden');
			this.cleanBoard();
			this.setDefaultComponents();
		}
		this.gameStarted = true;
		var self = this;
		lastTimestamp = Date.now();
		animationFrameId = requestAnimationFrame(self.mainLoop.bind(self));
		$("#startGame").prop('disabled', true);
	},

	moveSnake: function() {
		var last = this.body.pop();
		$(this.boardClass + ' ' + rowSelector(last.y) + ' ' + columnSelector(last.x)).removeClass('piece');
		var head = Object.assign({}, this.body[0]);
		if(!isSameOrOppositeDirection(this.snakeDirection, this.nextDirection)) {
			this.snakeDirection = this.nextDirection;
		}
		this.movePiece(head);
		$(this.boardClass + ' ' + rowSelector(head.y) + ' ' + columnSelector(head.x)).addClass('piece');
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
	},

	increaseScore: function() {
		$('.score span').text(parseInt($('.score span').text()) + 10);
	},

	increaseSpeed: function() {
		console.log(this.timeBeetwenFrames);
		this.timeBeetwenFrames-= this.getDecrementValue();
	},

	getDecrementValue: function() {
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
	},

	isOverMyself: function() {
		var tail = this.body.slice(1,this.body.length);
		var head = this.body[0];
		return tail.some(function(piece, index, array) {
				return samePosition(head, piece);
			}
		);
	},

	isOutOfBoard: function() {
		var outOfWidth = this.body[0].x > this.width || this.body[0].x < 1;
		var outOfHeight = this.body[0].y > this.height || this.body[0].y < 1;
		return outOfHeight || outOfWidth;
	},

	handleDeath: function() {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = undefined;
		}
		this.gameStarted = false;
		openTryAgainPopUp();
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
		if(delta > this.timeBeetwenFrames) {
			this.moveSnake();
			lastTimestamp = timestamp;
		}
	},

	mainLoop: function() {
		if(animationFrameId) {
			var timestamp = Date.now();
			var self = this;
			self.animate(timestamp);
			requestAnimationFrame(self.mainLoop.bind(self));
		}
	},

	setActionListeners: function() {
		var self = this;
		window.addEventListener("keydown", function(e) {
			if(e.keyCode < 41 && e.keyCode > 36) {
				self.nextDirection  = directionKeyCodes[e.keyCode];
			}
		}, false);
	},

	isOverFoodPosition: function() {
		return samePosition(this.body[0], this.food);
	},

	eatFood: function(lastPiece) {
		$(this.boardClass + ' ' + rowSelector(lastPiece.y) + ' ' + columnSelector(lastPiece.x)).addClass('piece');
		this.body.push(lastPiece);
		$(this.boardClass + ' ' + rowSelector(this.food.y) + ' ' + columnSelector(this.food.x)).removeClass('food');
	},

	createMoreFood: function() {
		this.food = this.randomAvailablePosition();
		this.drawFood();
	},

	randomAvailablePosition: function() {
		var position = randomPosition(this.width, this.height);
		while(!this.availablePosition(position)) {
			position = randomPosition(this.width, this.height);
		}
		return position;
	},

	availablePosition: function(position) {
		return this.body.every(function(piece, index, body) {
				return !samePosition(position, piece);
			}
		);
	}
};

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

function openTryAgainPopUp() {
	$('.message').css('visibility', 'visible');
	if (parseInt($("#amountOfPlayers").text()) === 0)
		$("#startGame").prop('disabled', false);
}
