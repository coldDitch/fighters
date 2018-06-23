


//global variables
var planeIMG;
var img;
var serverInt;
var ground;
var health;


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
  health=5;
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

  drawBullets();

  translate(x,y)

  serverInt.socket.on('hit',function(data){
    health=data;
  })


  //image rotation and update
  rotate(0.15+serverInt.getAngle());
  image(planeIMG,0,0,75,37.5);
  rotate(-(0.15+serverInt.getAngle()));


  var players=serverInt.getPlanes();
  var count=serverInt.getPlayerCount();


  for(var i in players){
    if(i>=players.length-count){
    someplayer=players.pop();
    drawPlane((someplayer.x-x),(someplayer.y-y),0.15+someplayer.angle);
  }
  }
  healthBar(health);
} //DRAW END


//draws other players
function drawPlane(xp,yp,angle){
  translate(xp,yp)
  rotate(angle)
  image(planeIMG,0,0,75,37.5);
  rotate(-angle)
  translate(-xp,-yp)
}


//draws healthbar to bottom right
 function healthBar(healthpoints){
   fill('#FFF');
   rect(width/2-510,height/2-50,500,40);
   fill(255,0,0);
   rect(width/2-510,height/2-50,100*healthpoints,40);
 }

function drawBullets(){
  var bullets=serverInt.getBullets();
  if(bullets.length>0){
    for(var i in bullets){
      console.log(bullets[i].x)
      fill(0)
      ellipse(bullets[i].x,bullets[i].y,5,5)
    }
  }
}

//keyboard for pressing key
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
  if(keyIsDown(CONTROL)) {
    console.log("ctrl");
    serverInt.socket.emit('keyPress',{inputID:'ctrl',state:true});
  }
}

//keyboard for releasing key
function keyReleased() {
    //key hold down
    if(!(keyIsDown(LEFT_ARROW))) {
      serverInt.socket.emit('keyPress',{inputID:'left',state:false});
    }
    if(!(keyIsDown(RIGHT_ARROW))) {
      serverInt.socket.emit('keyPress',{inputID:'right',state:false});
    }

    if(!(keyIsDown(CONTROL))) {
      serverInt.socket.emit('keyPress',{inputID:'ctrl',state:false});
    }
  }
