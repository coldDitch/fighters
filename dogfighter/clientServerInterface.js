function Interface() {
this.socket=io();

this.getX = function(){
  return x;
}

this.getY =function(){
  return y;
}

this.getAngle=function(){
  return orientation;
}

this.getPlanes=function(){
  return players;
}

this.getID=function(){
  return yourID;
}

this.getPlayerCount=function(){
  return numberOfPlayers;
}

this.socket.on('numberOfPlayers',function(data){
  numberOfPlayers=data;
});

this.socket.on('bullets',function(data){
  bullets=data;
});

this.getBullets=function(){
  return bullets;
}

var bullets=[];
var numberOfPlayers=0;
var yourID;
var x=0;
var y=0;
var orientation=0;

var players=[];


this.socket.on('yourID',function(data){
  console.log(data);
  yourID=data;
});

this.socket.on('newPositions',function(data){
  this.jotain=data;
  for(var i in data){
    if(data[i].id==yourID){
      x=data[i].x;
      y=data[i].y;
      orientation=data[i].angle;
    } else {
      players.push(data[i])
    }
  }
});

}
