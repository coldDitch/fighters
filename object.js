module.exports ={
player: function() {
  var math=require('mathjs')

    //relevant variables for planes properties
    const plane_speed=6;
    const speed_motors_off=1;

    //turning speed degrees pre frame
    this.angularspeed=2;

    //constant force downwards
    var gravity=0.1;
    //force dependent on angle on wings
    var stall_coeff=0.3;
    var healthpoints=5;


  this.speed = function (velocity) {
    temp=math.sqrt(math.pow(velocity[0],2)+math.pow(velocity[1],2));
    return temp;
  };

  this.y=0;
  this.x=0;
  this.velocity=[plane_speed,0];
  this.motorsOn=true;
  this.pressingRight=false;
  this.pressingLeft=false;
  this.pressingDown=false;
  this.id;


  this.gravity = function() {
    return stall_coeff/(this.orientation()+3/2*math.PI)+gravity;
  }

  this.giveSpeed = function(val,rate) {
    if(this.speed(this.velocity)<val-0.1) {
      this.velocity[0]=this.velocity[0]*(1+rate);
      this.velocity[1]=this.velocity[1]*(1+rate);
    }
    if(this.speed(this.velocity)>val+0.1) {
      this.velocity[0]=this.velocity[0]*(1-rate);
      this.velocity[1]=this.velocity[1]*(1-rate);
  }
}

  this.shoot = function() {

  }

  this.downArrow = function() {
  if(this.motorsOn){
    this.motorsOn=false;
    this.giveSpeed(plane_speed,0.4)
  } else {
    this.motorsOn=true;
    this.giveSpeed(speed_motors_off,0.1);
  }
}

  this.update = function() {

    if(this.pressingDown){
      this.downArrow();
    }
    if(this.pressingLeft){
      this.clockwise();
    }
    if(this.pressingRight){
      this.counterclockwise();
    }

    this.y += this.velocity[1];
    this.x += this.velocity[0];

    if(this.motorsOn){
      //update done motors on
      this.giveSpeed(plane_speed,0.1);
    } else {
      //update done motors off
      this.velocity[1]+=this.gravity()
      //drifting speed
      this.giveSpeed(speed_motors_off,0.0001)
    }
  }


    //function for determining direction of the plane
  this.orientation = function(){
      return math.atan2(this.velocity[1],this.velocity[0])
    }

    //transformations for turning plane
  this.counterclockwise = function() {
    //y'=x*sin(theta)+y*cos(theta)
    this.velocity[0]=this.velocity[0]*math.cos(this.angularspeed*math.PI/180)-this.velocity[1]*math.sin(this.angularspeed*math.PI/180);
    this.velocity[1]=this.velocity[0]*math.sin(this.angularspeed*math.PI/180)+this.velocity[1]*math.cos(this.angularspeed*math.PI/180);
    }

  this.clockwise = function() {
    //y'=x*sin(theta)+y*cos(theta)
    this.velocity[0]=this.velocity[0]*math.cos(-this.angularspeed*math.PI/180)-this.velocity[1]*math.sin(-this.angularspeed*math.PI/180);
    this.velocity[1]=this.velocity[0]*math.sin(-this.angularspeed*math.PI/180)+this.velocity[1]*math.cos(-this.angularspeed*math.PI/180);
  }
  return this;
}
}
