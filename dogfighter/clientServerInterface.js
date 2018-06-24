//class for resieving data from server

class Interface {
  constructor(){
    let self=this;
    this.socket=io();

    this.bullets=[];
    this.numberOfPlayers=0;
    this.yourID=0;
    this.place=[0,0];
    this.health=5;
    this.orientation=0;
    this.players=[];

    this.socket.on('yourID',function(data){
      console.log(data);
      self.yourID=data;
      });

    this.socket.on('numberOfPlayers',function(data){
      self.numberOfPlayers=data;
    })


    this.socket.on('newPositions',function(data){
          self.players=[];
          for(let i in data){
            if(data[i].id==self.yourID){
              self.place=data[i].place
              self.orientation=data[i].angle;
            } else {
              self.players.push(data[i])
            }
          }
        });

    this.socket.on('hit',function(data){
        self.health=data;
      });

    this.socket.on('bullets',function(data){
      self.bullets=data;
    })
}
}
