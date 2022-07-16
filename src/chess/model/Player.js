module.exports = class Player{
  constructor(id, socket){
    this.id = id; // id of the player in database
    this.socket = socket;
    this.idRoom = null;
  }

  enterInRoom(idRoom){
    this.idRoom = idRoom;

    this.getSocket().emit('enterInRoom', idRoom);

    console.log('Player: the player entered' + this.id + ' in room ' + this.idRoom);
  }

  leaveRoom(){
    console.log('Player: the player left' + this.id + ' in room ' + this.idRoom);

    this.getSocket().emit('leaveRoom', this.idRoom);

    this.idRoom = null;
  }

  getType(){
    if(this.id == undefined || this.id < 0){
      return 'guest';
    }else{
      return 'user';
    }
  }

  getName(){
    if(this.name == undefined){
      return 'guest';
    }
    //TODO: get name from database
    return this.name;
  }

  getSocket(){
    return this.socket;
  }

  getIdRoom(){
    return this.idRoom;
  }
}