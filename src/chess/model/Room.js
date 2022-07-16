const Chess = require('./Chess.js');

module.exports = class Room{
  constructor(id, type, io){
    this.id = id;
    this.type = type;
    this.io = io;

    this.players = new Array();

    console.log("Room: the room " + this.id + " is created whith type " + this.type);
  }

  addPlayer(player){
    if(this.isRoomFull()){
      console.log("Room: the room is full");
      return false;
    }

    this.players.push(player);

    player.enterInRoom(this.id);

    if(this.isRoomFull()){
      this.startGame();
    }
  }

  removePlayer(player){
    let index = this.players.indexOf(player);

    if(index != -1){
      this.players.splice(index, 1);
      player.leaveRoom();
    }
  }

  startGame(){
    console.log("Room: the game in room " + this.id + " is starting");

    this.chessTable = new Chess(this.type, this.players[0], this.players[1]);
    this.chessTable.startGame();
  }

  isRoomFull(){
    if(this.type == 'local'){
      return this.players.length == 1;
    }

    return this.players.length == 2;
  }

  isRoomEmpty(){
    return this.players.length == 0;
  }

  getId(){
    return this.id;
  }
}