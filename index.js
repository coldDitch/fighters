var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server,{});
var playerGen=require('./object');
var math=require('mathjs');

//express for pushing files
app.use(express.static(__dirname+'/dogfighter'));

server.listen(8080,function() {
  console.log("Server running");
});

//socket and player holders
SOCKET_LIST = [];
PLAYER_LIST = [];


io.sockets.on('connection',function(socket){
  //player object
  const player=new playerGen.player();
  console.log("Player Connected "+ SOCKET_LIST.length);
  socket.id=math.random()
  player.id=socket.id
  SOCKET_LIST[socket.id]=socket;
  PLAYER_LIST[player.id]=player;
  socket.emit('yourID', socket.id);
  socket.emit('numberOfPlayers', SOCKET_LIST.length);


  //disconnect a player
 socket.on('disconnect', function(){
   console.log("Player Disconnected");
   delete SOCKET_LIST[socket.id];
   delete PLAYER_LIST[player.id];
 });

 //key press forwarded to players function
 socket.on('keyPress',function(data){
   if(data.inputID==='left'){
     player.pressingLeft=data.state;
   } else if(data.inputID==='right'){
     player.pressingRight=data.state;
   } else if(data.inputID==='down'){
     player.downArrow();
   } else if(data.inputID==='ctrl'){
     
   }
 });

});


setInterval(function() {



  //initialise data packet
  var pack = [];

  //update data of all players
  for(let i in PLAYER_LIST) {
    let single=PLAYER_LIST[i]
    single.update();
    pack.push({
      x:single.x,
      y:single.y,
      id:single.id,
      angle:single.orientation()
    });
  }

  //send packet to all players
  for (let j in SOCKET_LIST) {
    SOCKET_LIST[j].emit('newPositions',pack);
  }


},1000/100);
