let dbAccess = require('../..//dbAccess/dbAccess');

module.exports = class Player{
  constructor(id, socket){
    this.id = id;
    this.socket = socket;
    this.idRoom = null;
    this.elo = '600';

    this.icone = 'default';
    this.country = 'default';
    this.ai = "Default"
  }

  setByDatabase(){
    dbAccess.getUserById(this.id, (data) => {
      this.nickname = data.nickname;
      this.elo = data.elo;
      this.icone = data.icone;
      this.country = data.country;
    });
  }

  initByDatabase(data){
    this.email = data.email;
    this.nickname = data.nickname;
    this.elo = data.elo;
    this.country = data.country;
    this.icone = data.icone;
    this.id = data.id;
    this.ai = data.ai;
  }

  enterInRoom(idRoom){
    this.idRoom = idRoom;
  }

  leaveRoom(){
    this.getSocket().emit('leaveRoom', this.idRoom);

    this.idRoom = null;
  }

  getType(){
    if(this.nickname == undefined){
      return 'guest';
    }else{
      return 'user';
    }
  }

  getName(){
    if(this.nickname == undefined){
      return 'guest';
    }

    return this.nickname;
  }

  getSocket(){
    return this.socket;
  }

  getIdRoom(){
    return this.idRoom;
  }

  getNameAI(){
    let nameAI = this.ai;

    nameAI = nameAI.split( '/' );
    nameAI = nameAI[nameAI.length - 1];

    return nameAI;
  }

  data(){
    if(this.getType() == 'guest'){
      return {
        id: this.id,
        nickname: this.getName(),
        type: 'player',
        elo: '?',
        idRoom: this.getIdRoom(),
        icone: this.icone,
        country: this.country,
        nameAI: this.getNameAI()
      }
    }else{
      return {
        id: this.id,
        nickname: this.getName(),
        type: this.getType(),
        elo: this.elo,
        idRoom: this.getIdRoom(),
        icone: this.icone,
        country: this.country,
        nameAI: this.getNameAI()
      }
    }
  }
}