var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server,{});
var Player=require('./Player');
var math=require('mathjs');
var Bullet=require('./bulletinstance');

//express for pushing files
app.use(express.static(__dirname+'/dogfighter'));

server.listen(8080,function() {
  console.log("Server running");
});

//socket and player holders
let SOCKET_LIST = [];
let PLAYER_LIST = [];
let bullet_list = [];
let intcount=0;

io.sockets.on('connection',function(socket){

  intcount++;

  //player object
  const player=new Player();
  console.log("Player Connected "+ intcount);
  socket.id=math.random()
  player.id=socket.id
  SOCKET_LIST[socket.id]=socket;
  PLAYER_LIST[player.id]=player;
  socket.emit('yourID', socket.id);
  pushNumber(intcount);

  //disconnect a player
 socket.on('disconnect', function(){
   console.log("Player Disconnected");
   intcount--;
   delete SOCKET_LIST[socket.id];
   delete PLAYER_LIST[player.id];
   pushNumber(intcount);
   console.log(intcount+" player left on server")
 });

 //key press forwarded to players function
 socket.on('keyPress',function(data){
   switch (data.inputID) {
     case 'left':
      player.pressingLeft=data.state;
      break;

      case'right':
      player.pressingRight=data.state;
      break;

      case 'down':
      player.downArrow();
      break;

      case 'ctrl':
      player.pressingCtrl=data.state;
      if(player.time>20){player.time=18}
      break;
   }
 });

});

function pushNumber(intCount){
  for(let i in SOCKET_LIST){
    let el=SOCKET_LIST[i];
    el.emit('numberOfPlayers',intCount)
    }
}

setInterval(function() {

 let bullets=[];
 if(bullet_list.length>0){
   bullet_list=bullet_list.filter(el=> el.lifetime>0);
   bullet_list.forEach(el => {
     el.update();
     bullets.push(el.place)
  });
}

  //initialise data packet
  let pack = [];

  //update data of all players
  for(let i in PLAYER_LIST) {
    let player=PLAYER_LIST[i]
  if(player.pressingCtrl&&(player.time%20)==0){
    let bul=new Bullet(player.velocity,player.place)
    bullet_list.push(bul);
  }
  player.time++;


  bullet_list.forEach((bullet,i)=>{
    if(player.check_collision_with(bullet.place)){
      player.health=player.health-1;
      if(player.health < 0){
        player.place=[0,0];
        player.health=5;
      }
      console.log("player hit "+ player.health);
      SOCKET_LIST[player.id].emit('hit',player.health);
      delete bullet_list[i];
    }
  });
    player.update();
    pack.push({
      place:player.place,
      id:player.id,
      angle:player.orientation()
    });
  }
  //send packet to all players
  for(let i in SOCKET_LIST){
    let socket=SOCKET_LIST[i]
    socket.emit('newPositions',pack);
    socket.emit('bullets',bullets);
  };


},1000/100);
