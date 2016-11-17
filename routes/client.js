var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public', '/client/join.html'));
});

router.get('/join/', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public', '/client/join.html'));
});

router.get('/player/', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public', '/client/player.html'));
});

module.exports = router;
