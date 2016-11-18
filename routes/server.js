var express = require('express');
var router = express.Router();
var path = require('path');
var base = require('../db').base;

router.get('/create', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public', '/server/create.html'));
});

router.get('/game', function(req, res, next){
  console.log("Me llego un req.params: " + JSON.stringify(req.query));
  base.insertRoom({
    room: req.query.room,
    pass: req.query.pass,
    amountOfPlayers: req.query.amountOfPlayers
  });
  console.log(base.getRooms());
  res.sendFile(path.join(__dirname, '../public', '/server/game.html'));
});

module.exports = router;
