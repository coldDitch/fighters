


//global variables
var planeIMG;
var img;
var serverInt;


  //preload images for better responsetime
function preload() {
  img=loadImage('forest.jpg')
  planeIMG=loadImage('albatrosc.png')
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

  //focus on plane
  translate(width/2-x,height/2-y)

  //register player commands eg. key hold down
  if(keyIsDown(LEFT_ARROW)) {
    console.log("left");
    serverInt.socket.emit('keyPress',{inputID:'left',state:true});
  } else {
    serverInt.socket.emit('keyPress',{inputID:'left',state:false});
  }
  if(keyIsDown(RIGHT_ARROW)) {
    console.log("right");
    serverInt.socket.emit('keyPress',{inputID:'right',state:true});
  } else {
    serverInt.socket.emit('keyPress',{inputID:'right',state:false});
  }

  if(keyIsDown(17)) {
    console.log("ctrl");
  }

  //loop for drawing continous background
  for (var i = 0; i < 10; i++) {
  image(img,i*2000,500);
  }

  //image rotation and update
  translate(x,y);
  rotate(0.15+serverInt.getAngle());
  translate(-x,-y);
  image(planeIMG,x,y);
}


//single clicker events
function keyPressed() {
  if(keyCode==DOWN_ARROW){
    console.log("down")
    serverInt.socket.emit('keyPress',{inputID:'down',state:true});
  }
}
