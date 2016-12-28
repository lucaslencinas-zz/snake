var express = require('express');
var router = express.Router();
var path = require('path');
var base = require('../db').base;

router.get('/create', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public', '/server/create.html'));
});

router.get('/game', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public', '/server/game.html'));
});

module.exports = router;
