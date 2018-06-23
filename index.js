var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server,{});
var playerGen=require('./object');
var math=require('mathjs');
var bulletGen=require('./bulletinstance');

//express for pushing files
app.use(express.static(__dirname+'/dogfighter'));

server.listen(8080,function() {
  console.log("Server running");
});

//socket and player holders
SOCKET_LIST = [];
PLAYER_LIST = [];
bullet_list = [];
intcount=0;

io.sockets.on('connection',function(socket){

  intcount++;
  //player object
  const player=new playerGen.player();
  console.log("Player Connected "+ intcount);
  socket.id=math.random()
  player.id=socket.id
  SOCKET_LIST[socket.id]=socket;
  PLAYER_LIST[player.id]=player;
  socket.emit('yourID', socket.id);
  for (let j in SOCKET_LIST) {
  SOCKET_LIST[j].emit('numberOfPlayers', intcount);
}


  //disconnect a player
 socket.on('disconnect', function(){
   console.log("Player Disconnected");
   intcount--;
   delete SOCKET_LIST[socket.id];
   delete PLAYER_LIST[player.id];
   console.log(intcount+" player left on server")
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
     player.pressingCtrl=data.state;
     if(player.time>100){player.time=18}
   }
 });

});





setInterval(function() {

 var bullets=[];
 if(bullet_list.length>0){
  for(let i in bullet_list) {
    singleBullet=bullet_list[i]
    singleBullet.update();
    if(singleBullet.lifetime<1){
      delete bullet_list[i];
    } else {
      bullets.push({
        x:singleBullet.x,
        y:singleBullet.y
      });
    }
  }
}

  for(let i in PLAYER_LIST) {
    player=PLAYER_LIST[i]

    if(player.pressingCtrl&&(player.time%20)==0){
      let bul=new bulletGen.bullet(player.velocity,player.x,player.y)
      bullet_list.push(bul);
    }

    player.time++;

    for(let j in bullet_list) {
      if(i!=j){
        if(player.check_collision_with(bullet_list[j].x,bullet_list[j].y)){
          player.health=player.health-1
          if(player.health < 0){
            player.x=0;
            player.y=0;
            player.health=5;
          }
          console.log("player hit "+ player.health)
          SOCKET_LIST[i].emit('hit',player.health);
          delete bullet_list[j];
        }
      }
    }
  }

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
    SOCKET_LIST[j].emit('bullets',bullets);
  }


},1000/100);
