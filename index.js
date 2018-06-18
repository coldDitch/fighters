var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server,{});
var playerGen=require('./object');
var math=require('mathjs')

//express for pushing files
app.use(express.static(__dirname+'/dogfighter'));

server.listen(8080,function() {
  console.log("Server running");
});

//socket and player holders
var SOCKET_LIST = {};
var PLAYER_LIST = {};


io.sockets.on('connection',function(socket){

  //player object
  console.log("Player Connected");
  socket.id=math.random();
  var player;
  player=playerGen.player();
  player.id=socket.id;

  SOCKET_LIST[socket.id]=socket;
  PLAYER_LIST[socket.id]=player;
  socket.emit('yourID',socket.id);


  //disconnect a player
  socket.on('disconnect', function(){
    delete SOCKET_LIST[socket.id];
    delete PLAYER_LIST[socket.id];
  });

  //key press forwarded to players function
  socket.on('keyPress',function(data){
    if(data.inputID==='left'){
      player.pressingLeft=data.state
    } else if(data.inputID==='right'){
      player.pressingRight=data.state
    } else if(data.inputID==='down'){
      player.downArrow();
    }
  });
});


setInterval(function() {
  //initialise data packet
  var pack = [];

  //update data of all players
  for(var i in PLAYER_LIST) {
    var player = PLAYER_LIST[i];
    player.update();
    pack.push({
      x:player.x,
      y:player.y,
      id:player.id,
      angle:player.orientation()
    });
  }

  //send packet to all players
  for (var i in SOCKET_LIST) {
    var socket = SOCKET_LIST[i];
    socket.emit('newPositions',pack);
  }


},1000/60);
