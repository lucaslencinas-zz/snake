'use strict';

/* Class Room */

var directionKeyCodes = {
  team1: {
    65: directions.LEFT,
    87: directions.UP,
    68: directions.RIGHT,
    83: directions.DOWN
  },
  team2: {
    37: directions.LEFT,
    38: directions.UP,
    39: directions.RIGHT,
    40: directions.DOWN
  }
};

var Room = function(config) {
  var self = this;
	Object.assign(this, config);
  this.buttons1 = this.initButtons('team1');
  this.buttons2 = this.initButtons('team2');

  this.game1 = new Game({
    amountOfPlayers: this.amountOfPlayers / 2,
    board: {
      selector: '.team1 .board',
      height:   $('.team1 .board').height()/25,
      width:    $('.team1 .board').width()/25
    },
    buttons:         this.buttons1,
    directionKeyCodes: directionKeyCodes.team1,
    room:            this.room + '1',
    pass:            this.pass,
    teamSelector:    '.team1',
    roomHandler:     this
  });

  this.game2 = new Game({
    amountOfPlayers: this.amountOfPlayers / 2,
    board: {
      selector: '.team2 .board',
      height:   $('.team2 .board').height()/25,
      width:    $('.team2 .board').width()/25
    },
    buttons:         this.buttons2,
    directionKeyCodes: directionKeyCodes.team2,
    room:            this.room + '2',
    pass:            this.pass,
    teamSelector:    '.team2',
    roomHandler:     this
  });

  window.addEventListener("keydown", function(e) {
    self.game1.keyDown(e.keyCode);
    self.game2.keyDown(e.keyCode);
  }, false);

  $("#startGame").click(function(){
    self.game1.startGame();
    self.game2.startGame();
  });
}

Room.prototype.initButtons = function(team) {
  var buttons = [];
  $('.' + team + ' .players div').each(function(index) {
    buttons.push({
      id:         $(this).attr('id'),
      set:        false,
      direction:  directionKeyCodes[team][$(this).data('code')],
      keyCode:    $(this).data('code')
    });
  });
  return buttons;
}

Room.prototype.handleDeath = function(teamSelector) {
if(teamSelector === '.team1') {
  this.game2.endGame();
} else {
  this.game1.endGame();
}
this.openTryAgainPopUp(teamSelector);
}

Room.prototype.openTryAgainPopUp = function(team) {
  $('.message').css('visibility', 'visible');
  $('.message span').text(team);
  if (parseInt($("#amountOfPlayers").text()) === 0)
    $("#startGame").prop('disabled', false);
}
