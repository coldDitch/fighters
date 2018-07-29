var math=require('mathjs');
module.exports=class Player {

  constructor(name,team){
    this.player_name=name
    this.team=team
    //relevant properties of plane
    this.plane_speed=3;
    this.speed_motors_off=1;
    this.plane_length=40;
    this.plane_height=20;
    this.health=5;

    //turning speed degrees pre frame
    this.angularspeed=2;

    //constant force downwards
    this.gravity=0.01;
    //force dependent on angle on wings
    this.stall_coeff=0.05;

    //starting state of a plane
    this.time=0;
    this.place=[0,0]
    this.velocity=[0,0]
    this.kill()
    this.motorsOn=true;
    this.pressingRight=false;
    this.pressingLeft=false;
    this.pressingDown=false;
    this.pressingCtrl=false;
    this.id;
    this.dirCount=0;
  }

  kill(){
    if(this.team=="axis"){
      this.place=[0,0];
      this.health=5;
      this.velocity=[this.plane_speed,0]
    }
    if(this.team=="allied"){
      this.place=[8000,0]
      this.health=5
      this.velocity=[-this.plane_speed,0]
    }
  }

  //speed of this plane
  speed() {
    return math.sqrt(this.velocity.map(i=>math.pow(i,2)).reduce((i,j)=>i+j));
  }

  //returns stalling of the plane. defines how well plane can fly upward
  // TODO: find stalling function that matches preferred gameplay
  stall() {
    let dir=this.orientation();
    if(dir<0){
      dir+=2*math.PI
    }
      return 1/(10*this.speed())
  }

  //soft way of fixing speed.
  //val-> aproached speed,
  //rate -> how quickly speed is aproached
  giveSpeed(val,rate) {
    if(this.speed()<val-0.1) {
      this.velocity=this.velocity.map(el=>el*(1+rate));
    }
    if(this.speed()>val+0.1) {
      this.velocity=this.velocity.map(el=>el*(1-rate));
    }
  }

  //checks if given point is in plane.
  //hitbox is defined by two lines parralel to movement of plane and a circle
  //hitbox is hence shaped almost like rectangle but with rounded head and tail
  check_collision_with(obj){
    const y_value_inder=math.abs(this.plane_height/math.cos(this.orientation()));
    const radius=math.sqrt(math.sum(this.place.map((el,i)=>math.pow(el-obj[i],2))));
    const top=this.y+y_value_inder;
    const bottom=this.y-y_value_inder;

    if(radius<this.plane_length){
      return true
    } else {
      return false
    }
  }

  //case event for shutting down and starting up motors
  downArrow() {
    if(this.motorsOn){
      this.motorsOn=false;
      this.giveSpeed(this.plane_speed,0.1)
    } else {
      this.motorsOn=true;
      this.giveSpeed(this.speed_motors_off,0.1);
    }
  }

  //checks the state of the plane and updates its properties;
  update() {

    if(this.pressingDown){
      this.downArrow();
    }
    if(this.pressingLeft){
      this.turn(1);
    }
    if(this.pressingRight){
      this.turn(-1);
    }
    if(this.motorsOn){
      //update done motors on
      this.giveSpeed(this.plane_speed,0.1);

    } else {
      //update done motors off
      this.velocity[1]+=this.gravity+this.stall();
      //drifting speed
      this.giveSpeed(this.speed_motors_off,0.001)
    }

    //update place
    this.place=this.place.map((el,i) => el+this.velocity[i])

  }


    //function for determining direction of the plane
  orientation(){
    return math.atan2(this.velocity[1],this.velocity[0]);
    }

    //transformations for turning plane
  turn(dir){
    let x=this.velocity[0]
    let y=this.velocity[1]
    let theta=this.angularspeed
    let deg=math.PI/180
    //counterclockwise
    if(dir===-1)  {
      x=x*math.cos(theta*deg)-y*math.sin(theta*deg);
      y=x*math.sin(theta*deg)+y*math.cos(theta*deg);
    }
    //clockwise
    if(dir===1){
      x=x*math.cos(-theta*deg)-y*math.sin(-theta*deg);
      y=x*math.sin(-theta*deg)+y*math.cos(-theta*deg);
    }
    this.velocity=[x,y];
  }
}
