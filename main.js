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
 var ROOM_LIST=[]
  let test=new Room("test",8)

io.sockets.on('connection',function(socket){
  //player object
  ROOM_LIST[test.name]=test
  const player=new Player("testplayer"+ROOM_LIST[test.name].intcount,"allied");

  socket_event.push_rooms(ROOM_LIST,socket)
  //creates new room
  socket.on('create_room',data=>{
    const temp=new Room(data.name,data.size)
    ROOM_LIST[temp.id]=temp})

  socket.on('join',data=>{ROOM_LIST[data].add_player(socket,player)})
  //disconnect a player
  socket.on('disconnect',()=>ROOM_LIST[test.name].remove_player(socket,player));

  //key press forwarded to players function
  socket.on('keyPress',data=>socket_event.keypress_event(data,player));

});

//updates all rooms at 100Hz frequenzy
setInterval(function() {
for(let i in ROOM_LIST){
  if(ROOM_LIST[i].intcount>0){
  ROOM_LIST[i].update()
}
}
},1000/100);
