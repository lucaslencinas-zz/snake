var express = require('express');
var router = express.Router();
var path = require('path');
var base = require('../db').base;

router.get('/create', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public', '/server/create.html'));
});

router.get('/game', function(req, res, next){
  console.log(req.query);
  if(parseInt(req.query.amountOfPlayers) === 4) {
    res.sendFile(path.join(__dirname, '../public', '/server/game.html'));
  } else {
    if (parseInt(req.query.amountOfPlayers) === 8) {
      res.sendFile(path.join(__dirname, '../public', '/server/game2snakes.html'));
    } else {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    }
  }
});

module.exports = router;
