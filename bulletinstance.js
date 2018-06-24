module.exports =class Bullet{
  constructor(velocity,place) {
    this.lifetime=200;
    this.velocity=[velocity[0]*2,velocity[1]*2];
    this.place=place.map((el,i)=>el+velocity[i]*20)
  }

    update() {
      this.place=this.place.map((el,i)=>el+this.velocity[i])
      this.lifetime-=1
    }
}
