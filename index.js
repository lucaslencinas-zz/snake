var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/create/', function(req, res){
  res.sendFile(__dirname + '/server/create.html');
});

app.get('/game/', function(req, res){
  res.sendFile(__dirname + '/server/game.html');
});

app.get('/join/', function(req, res){
  res.sendFile(__dirname + '/client/join.html');
});

app.get('/player/', function(req, res){
  res.sendFile(__dirname + '/client/player.html');
});
app.get('/getting_started/', function(req, res){
  res.sendFile(__dirname + '/server/getting_started.html');
});

io.on('connection', function(socket){
  socket.on('button clicked', function(msg){
    io.emit('button clicked', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
