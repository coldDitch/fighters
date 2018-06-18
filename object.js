module.exports ={
player: function() {
  const math=require('mathjs')
    this.y=0;
    this.x=0;
    this.id=10;


  this.speed = function (velocity) {
    temp=math.sqrt(math.pow(velocity[0],2)+math.pow(velocity[1],2));
    return temp;
  };

  this.velocity=[15,0];
  this.angularspeed=1.5;
  this.motorsOn=true;
  this.healthpoints=5;
  this.pressingRight=false;
  this.pressingLeft=false;
  this.pressingDown=false;


  this.gravity = function() {
    return 0.6/(this.orientation()+3/2*math.PI)+0.3;
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
    this.giveSpeed(7,0.4)
  } else {
    this.motorsOn=true;
    this.giveSpeed(10,0.1);
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
      this.giveSpeed(20,0.1);
    } else {
      //update done motors off
      this.velocity[1]+=this.gravity()
      //drifting speed
      this.giveSpeed(3,0.0001)
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
