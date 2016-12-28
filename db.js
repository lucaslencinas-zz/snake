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
    console.log('Total players In DB: ' + this.getPlayers().length);
  },
  insertRoom: function(room) {
    rooms.insert(room);
    console.log('Total rooms In DB: ' + this.getRooms().length);
  },
  getPlayers: function() {
    return players.data;
  },
  getRoomPlayers: function(room) {
    return players.data.filter(function(player) {
      return room === player.room
    });
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
  },
  removeRoomById: function(id){
    rooms.removeWhere({ 'id': id });
  },
  getRoomFromPlayerId: function(playerId) {
    var player = players.find({ 'id': playerId })[0];
    return rooms.find({ 'room': player.room })[0];
  }
};
