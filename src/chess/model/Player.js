module.exports = class Player{
  constructor(id, socket){
    this.id = id; // id of the player in database
    this.socket = socket;
    this.idRoom = null;
    this.elo = "600";

    this.icone = "https://imgs.search.brave.com/wORNSfxDwo61k7YcRGetTHadz-ymQM1AtNaIqpURPus/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/MjRudjJ3d2RtMWsz/MS5qcGc_YXV0bz13/ZWJwJnM9YjY3NTgy/OTdmOGE2NjZjMTgz/MTE5YzAyYzMwNGE0/MjkyNjdjMTI5ZA";
    this.flag = "https://imgs.search.brave.com/dSAbbarvdjtLJjWVLhydQCknwVVLlggOhTRavonnTXU/rs:fit:1200:1200:1/g:ce/aHR0cDovL3d3dy5h/cGFydG1lbnRiYXJj/ZWxvbmEuY29tL2Js/b2cvd3AtY29udGVu/dC91cGxvYWRzLzIw/MTUvMDcvQ2F0YWxh/bi1GbGFnLnBuZw";
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

  data(){
    return {
      id: this.id,
      name: this.getName(),
      type: this.getType(),
      elo: this.elo,
      idRoom: this.getIdRoom(),
      icone: this.icone,
      flag: this.flag
    }
  }
}