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
  },
  findPlayer: function(id) {
    return players.find({ 'id': id })[0];
  },
  findRoom: function(room, pass) {
    return rooms.find({ 'room': room, 'pass': pass })[0];
  },
  removePlayerById: function(id){
    players.removeWhere({ 'id': id });
  }
};
