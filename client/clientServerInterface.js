//class for resieving data from server

class Interface {
  constructor(){
    let self=this;
    this.axis=0
    this.allied=0
    this.socket=io();
    this.bullets=[];
    this.numberOfPlayers=0;
    this.yourID=0;
    this.place=[0,0];
    this.health=5;
    this.name="NULL"
    this.orientation=0;
    this.players=[];

    this.socket.on('yourID',function(data){
      console.log(data);
      self.yourID=data.id;
      });

    this.socket.on('numberOfPlayers',function(data){
      self.numberOfPlayers=data;
    })


    this.socket.on('newPositions',function(data){
          self.players=[];
          for(let i in data){
            if(data[i].id==self.yourID){
              self.place=data[i].place
              self.orientation=data[i].angle
              self.name=data[i].name
            } else {
              self.players.push(data[i])
            }
          }
        });

    this.socket.on('points',(data)=>{
      self.axis=data.axis
      self.allied=data.allied
    })

    this.socket.on('hit',function(data){
        self.health=data;
      });

    this.socket.on('bullets',function(data){
      self.bullets=data;
    })
}
}
