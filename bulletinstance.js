module.exports ={
  bullet: function(velocity,x,y) {
    var math=require('mathjs')
    this.lifetime=200;
    this.velocity=[velocity[0]*2,velocity[1]*2];
    this.x=x+20*this.velocity[0];
    this.y=y+20*this.velocity[1];

    this.update=function() {
      this.x+=this.velocity[0];
      this.y+=this.velocity[1];
      this.lifetime-=1
    }
  }
}
