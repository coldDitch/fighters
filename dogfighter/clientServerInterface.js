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

var jotain={};
var yourID=0;
var x=0;
var y=0;
var orientation=0;

this.update= function(x,y,angle) {
  this.x=x;
  this.y=y;
  this.orientation=angle;
}

this.socket.on('yourID',function(data){
  yourID=data;
});

this.socket.on('newPositions',function(data){
  jotain=data;
  for(var i in data){
      x=data[i].x;
      y=data[i].y;
      orientation=data[i].angle;
  }
});

}
