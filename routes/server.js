var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/create/', function(req, res){
  res.sendFile(path.join(__dirname, '../public', '/server/create.html'));
});

router.get('/game/', function(req, res){
  res.sendFile(path.join(__dirname, '../public', '/server/game.html'));
});

router.get('/getting_started/', function(req, res){
  res.sendFile(path.join(__dirname, '../public', '/server/getting_started.html'));
});

module.exports = router;
