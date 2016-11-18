var loki = require('lokijs');

var db;
var players;
var rooms;

module.exports.base = {
  create: function() {
    db = new loki('loki.json');
    players = db.addCollection('players');
    rooms = db.addCollection('rooms');
    return "ok";
  },
  insertPlayer: function(player) {
    players.insert(player);
  },
  insertRoom: function(room) {
    rooms.insert(room);
  },
  getPlayers: function() {
    return players.data;
  },
  getRooms: function() {
    return rooms.data;
  }
};
