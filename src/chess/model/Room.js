const Chess = require('./Chess.js');

module.exports = class Room{
  constructor(id, type, io){
    this.id = id;
    this.type = type;
    this.io = io;

    this.players = new Array();
  }

  addPlayer(player){
    if(this.isRoomFull()){
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
    if(this.players[0] != undefined && this.players[1] != undefined){
      console.log("Room: the game in room " + this.id + " is starting whit the players" + this.players[0].nickname + " and " + this.players[1].nickname);
    }else{
      console.log("Room: the game in room " + this.id + " is starting whit the player " + this.players[0].nickname);
    }

    this.chessTable = new Chess(this.type, this.players[0], this.players[1]);
    this.chessTable.startGame();
  }

  isRoomFull(){
    if(this.type != 'versus'){
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