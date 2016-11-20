var express = require('express');
var router = express.Router();
var path = require('path');
var base = require('../db').base;

router.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public', '/client/join.html'));
});

router.get('/join', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public', '/client/join.html'));
});

router.get('/player', function(req, res, next){
  if(base.findRoom(req.query.room, req.query.pass) === undefined){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
    res.sendFile(path.join(__dirname, '../public', '/client/player.html'));
  }
});

module.exports = router;
