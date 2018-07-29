var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server,{});
var Player=require('./Player');
var socket_event=require('./socket_events')
var Room=require('./room')

//express for pushing files
app.use(express.static(__dirname+'/client'));

//local testing environment
server.listen(8080,function() {
  console.log("Server running");
});

//room holder TODO room creationg
  ROOM_LIST=[]
  let test=new Room("testroom")
  ROOM_LIST[test.id]=test

io.sockets.on('connection',function(socket){
  //player object
  const player=new Player("testplayer"+ROOM_LIST[test.id].intcount,"allied");

  //add player to room
  ROOM_LIST[test.id].add_player(socket,player)

  //disconnect a player
  socket.on('disconnect',()=>ROOM_LIST[test.id].remove_player(socket,player));

  //key press forwarded to players function
  socket.on('keyPress',data=>socket_event.keypress_event(data,player));

});

//updates all rooms at 100Hz frequenzy
setInterval(function() {
for(let i in ROOM_LIST){
  ROOM_LIST[i].update()
}
},1000/100);
