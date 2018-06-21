


//global variables
var planeIMG;
var img;
var serverInt;
var ground;


  //preload images for better responsetime
function preload() {
  img=loadImage('forest.jpg')
  planeIMG=loadImage('fokkerc.png')
  ground=loadImage('grass.png')
}

  //setup gaming environment
function setup()  {
  createCanvas(1500,1000);
  imageMode(CENTER);
  serverInt=new Interface();
}

  //function for drawing graphics. called 60time/s
function draw() {
  //setup blue background
  background(0,10,500);

  var x=serverInt.getX();
  var y=serverInt.getY();

  translate(width/2-x,height/2-y);
  //draw other planes

  //loop for drawing continous background
  for (var i = 0; i < 10; i++) {
  image(ground,2000*i,500,2000,100);
  image(img,i*2000+0.5*x,0);
  }
  translate(x,y)

  //image rotation and update
  rotate(0.15+serverInt.getAngle());
  image(planeIMG,0,0,100,50);
  rotate(-(0.15+serverInt.getAngle()));
  var players=serverInt.getPlanes();
  var count=serverInt.getPlayerCount();

  for(var i in players){
    if(i<=count){
    someplayer=players.pop();
    drawPlane((someplayer.x-x),(someplayer.y-y),0.15+someplayer.angle);
    }
  }
}

function drawPlane(xp,yp,angle){
  translate(xp,yp)
  rotate(angle)
  image(planeIMG,0,0,100,50);
  rotate(-angle)
  translate(-xp,-yp)
}



//keyboard events
function keyPressed() {
  //simple click event
  if(keyCode==DOWN_ARROW){
    console.log("down")
    serverInt.socket.emit('keyPress',{inputID:'down',state:true});
  }

  //key hold down
  if(keyIsDown(LEFT_ARROW)) {
    console.log("left");
    serverInt.socket.emit('keyPress',{inputID:'left',state:true});
  }
  if(keyIsDown(RIGHT_ARROW)) {
    console.log("right");
    serverInt.socket.emit('keyPress',{inputID:'right',state:true});
  }
  if(keyIsDown(17)) {
    console.log("ctrl");
    socketInt.socket.emit('keyPress',{inputID:'ctrl',state:true});
  }
 }

  function keyReleased() {
    //key hold down
    if(!(keyIsDown(LEFT_ARROW))) {
      console.log("left");
      serverInt.socket.emit('keyPress',{inputID:'left',state:false});
    }
    if(!(keyIsDown(RIGHT_ARROW))) {
      console.log("right");
      serverInt.socket.emit('keyPress',{inputID:'right',state:false});
    }

    if(!(keyIsDown(17))) {
      console.log("ctrl");
      socketInt.socket.emit('keyPress',{inputID:'ctrl',state:false});
    }
  }
