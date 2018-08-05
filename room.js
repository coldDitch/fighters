var socket_event=require('./socket_events')
var math=require('mathjs')
var Bullet=require('./bulletinstance')
module.exports=class Room{
  constructor(name){
    this.allied_points=0
    this.axis_points=0
    this.name=name
    this.SOCKET_LIST=[]
    this.PLAYER_LIST =[]
    this.bullet_list = []
    this.id=math.random()
    this.intcount=0
  }

  add_player(socket,player){
    this.intcount++
    socket.id=math.random()
    player.id=socket.id
    this.SOCKET_LIST[socket.id]=socket
    this.PLAYER_LIST[player.id]=player
    socket.emit('yourID', {id:socket.id,name:player.name})
    socket_event.push_number(this.intcount,this.SOCKET_LIST)

    console.log("Player number "
    + this.intcount + " connected to room "+ this.name)
  }

  remove_player(socket,player){
    console.log("Player Disconnected")
    this.intcount--
    delete this.SOCKET_LIST[socket.id]
    delete this.PLAYER_LIST[player.id]
    console.log(this.intcount+" player left on server")
    socket_event.push_number(this.intcount,this.SOCKET_LIST)
  }

  calculate_points(killer,killed){
    switch (killer) {
      case "allied":
        if(killed=="allied"){
          this.allied_points-=8
        } else {
          this.allied_points+=10
        }

        break;
      case "axis":
      if(killed=="axis"){
        this.allied_points-=8
      } else {
        this.allied_points+=10
      }

        break;
      case "environment":
        if(killed=="allied"){
          this.allied_points-=5
        } else {
          this.axis_points-=5
        }

        break;

    }
    for(let i in this.SOCKET_LIST){
      let socket=this.SOCKET_LIST[i]
      socket.emit('points',{allied:this.allied_points,axis:this.axis_points})
    }
  }


  //updates all elements in room
  update(){
     let bullets=[];
     if(this.bullet_list.length>0){
       this.bullet_list=this.bullet_list.filter(el=> el.lifetime>0);
       this.bullet_list.forEach(el => {
         el.update();
         bullets.push(el.place)
      });
    }

      //initialise data packet
      let pack = [];

      //update data of all players
      for(let i in this.PLAYER_LIST) {
        let player=this.PLAYER_LIST[i]
      if(player.pressingCtrl&&(player.time%20)==0){
        let bul=new Bullet(player.velocity,player.place,player.team)
        this.bullet_list.push(bul);
      }
      player.time++;


      this.bullet_list.forEach((bullet,i)=>{
        if(player.check_collision_with(bullet.place)){
          player.health=player.health-1;
          if(player.health < 0){
            this.calculate_points(bullet.team,player.team)
            player.kill()
          }
          this.SOCKET_LIST[player.id].emit('hit',player.health);
          delete this.bullet_list[i];
        }
      });
        //TODO better collision check
        if(-1000<player.place[0]&&
          player.place[0]<10000&&
          -1000<player.place[1]&&
          player.place[1]<330){
        } else {
          this.calculate_points("environment",player.team)
          player.kill()
        }

        player.update();
        pack.push({
          place:player.place,
          id:player.id,
          angle:player.orientation(),
          name:player.player_name
        });
      }
      //send packet to all players
      for(let i in this.SOCKET_LIST){
        let socket=this.SOCKET_LIST[i]
        socket.emit('newPositions',pack);
        socket.emit('bullets',bullets);
      };
  }
}
