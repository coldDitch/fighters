


//global variables
let planeIMG;
let img;
let serverInt;
let ground;
let health;


  //preload images for better responsetime
function preload() {
  img=loadImage('Mountains Background.png')
  planeIMG=loadImage('Biplane.png')
  ground=loadImage('ground.png')
  heart=loadImage('heart.png')
}

  //setup gaming environment
function setup()  {
  createCanvas(1500,750);
  imageMode(CENTER);
  serverInt=new Interface();
  health=5;
}




  //function for drawing graphics. called 60time/s
function draw() {



  //setup blue background
  background(0,10,30);

  let x=serverInt.place[0];
  let y=serverInt.place[1];


  translate(width/2-x,height/2-y);


  //draw other planes


  //loop for drawing continous background
  for (let i = 0; i < 10; i++) {
  let background_x=i*2000+0.5*x
  let background_y=0
  let ground_y=500
  let ground_x=2000*i
  if(x-width/2<background_x<x+width/2){
    image(img,background_x,background_y=0);
  }
  if(x-width<ground_x<x+width)
  image(ground,ground_x,ground_y,2000,300);
  }

  drawBullets();

  translate(x,y)


  //image rotation and update
  fill(0,0,255)
  text(serverInt.name,-25,-30)
  rotate(0.15+serverInt.orientation);
  image(planeIMG,0,0,75,37.5);
  rotate(-(0.15+serverInt.orientation));




  serverInt.players.forEach(el=>{
    drawPlane((el.place[0]-x),(el.place[1]-y),0.15+el.angle,el.name);
  });

  statusBar(serverInt.health,serverInt.axis,serverInt.allied);
} //DRAW END


//draws other players
function drawPlane(xp,yp,angle,name){
  translate(xp,yp)
  fill(0,0,255)
  text(name,-25,-30)
  rotate(angle)
  image(planeIMG,0,0,75,37.5);
  rotate(-angle)
  translate(-xp,-yp)
}

function statusBar(healthpoints,axis,allied){
  fill(139,69,19);
  rect(-width/2,height/2-100,width,100)
  healthBar(healthpoints)
  fill('#FFF');
  text("Allied points: "+allied,100-width/2,height/2-50)
  text("Axis points: "+axis,100-width/2,height/2-70)
}


//draws healthbar to bottom right
 function healthBar(healthpoints){
   image(heart,width/2-540,height/2-35)
   fill('#FFF');
   rect(width/2-510,height/2-50,500,40);
   fill(255,0,0);
   rect(width/2-510,height/2-50,100*healthpoints,40);
 }

function drawBullets(){
  serverInt.bullets.forEach(bullet=>{
      fill(300)
      ellipse(bullet[0],bullet[1],5,5)
    });
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
