var main=require('./main')
var Player=require('./Player');
var math=require('mathjs');
var Room=require('./room')

//export modules
module.exports.keypress_event=keypress_event
module.exports.push_number=push_number
module.exports.push_rooms=push_rooms


//create new Room

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

function push_rooms(LIST,socket){
  let names=[]
  for(let i in LIST){
    names.push(i)
  }
  socket.emit('rooms',names)
}


function push_number(intcount,LIST){
  for(let i in LIST){
    let el=LIST[i];
    el.emit('numberOfPlayers',intcount)
    }
}
