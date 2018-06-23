module.exports ={
player: function() {
  var math=require('mathjs')

    //relevant variables for planes properties
    const plane_speed=3;
    const speed_motors_off=0.5;
    const plane_length=40;
    const plane_height=20;

    //turning speed degrees pre frame
    this.angularspeed=2;

    //constant force downwards
    var gravity=0.01;
    //force dependent on angle on wings
    var stall_coeff=0.3;
    this.health=5;


  this.speed = function (velocity) {
    temp=math.sqrt(math.pow(velocity[0],2)+math.pow(velocity[1],2));
    return temp;
  };

  this.time=0;
  this.y=0;
  this.x=0;
  this.velocity=[plane_speed,0];
  this.motorsOn=true;
  this.pressingRight=false;
  this.pressingLeft=false;
  this.pressingDown=false;
  this.pressingCtrl=false;
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

  this.check_collision_with = function(xp,yp){
    var y_value_inder=plane_height/math.cos(this.orientation());
    var radius=math.sqrt(math.pow(this.x-xp,2)+math.pow(this.y-yp,2));
    var top=this.y+y_value_inder;
    var bottom=this.y-y_value_inder;

    if(radius<plane_length&&(yp<top&&yp>bottom)){
      return true
    } else {
      return false
    }
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
