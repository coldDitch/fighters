var main=require('./main')
var Player=require('./Player');
var math=require('mathjs');

//export modules
module.exports.disconnect=disconnect
module.exports.keypress_event=keypress_event
module.exports.push_number=push_number

//function for handling player commands
function keypress_event(data,player){
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
}

function disconnect(socket,player){
  console.log("Player Disconnected");
  intcount--;
  delete SOCKET_LIST[socket.id];
  delete PLAYER_LIST[player.id];
  push_number(intcount);
  console.log(intcount+" player left on server")
}

function push_number(){
  for(let i in SOCKET_LIST){
    let el=SOCKET_LIST[i];
    el.emit('numberOfPlayers',global.intCount)
    }
}
