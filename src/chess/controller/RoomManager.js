const Player = require('../model/Player');
const Room = require('../model/Room');
const db = require('../../dbAccess/dbAccess');
const { param } = require('../../routes/routesChess');

module.exports = class RoomManager{
  constructor(io){
    this.rooms = new Array();
    this.io = io;
    this.listen();
  }

  addRoom(type){
    let id = this.getAvailableId();

    this.rooms[id] = new Room(id, type, this.io);

    return id;
  }

  getRoom(id){
    return this.rooms[id];
  }

  addPlayer(idRoom, player){
    this.rooms[idRoom].addPlayer(player);
  }
  
  addAI(idRoom, playerAI, color){
    this.rooms[idRoom].addAI(playerAI, color);
  }

  getAvailableId(){
    let id = Math.random().toString(36).slice(2);

		while (this.rooms.includes(id)){
			id = Math.random().toString(36).slice(2);
		}

		return id;
  }

  /** SOCKET TREATMENT **/

  listen(){
    this.io.on('connection', async (socket) => {
      let player = new Player();
      player.socket = socket;

      socket.on('play', async (typeGame, idSession, parametersGame) => {
        let playerDB = await db.getUserBySession(idSession);

        if(playerDB != null || playerDB != undefined){
          player.initByDatabase(playerDB);
        }

        this.onPlay(typeGame, player, parametersGame);
      });

      socket.on('disconnect', () => {
          if(player != null){
            let room = this.getRoom(player.getIdRoom());

            setTimeout(() => { 
              if(room != null){
                room.removePlayer(player);

                if(room.isRoomEmpty()){
                  console.log('RoomManager: the room ' + room.getId() + ' is deleted');
                  delete this.rooms[room.getId()];
                }
              }
            }, 3000);
          }
      });
    });
  }


  onPlay(typeGame, player, parametersGame){
    if(typeGame != 'local' && player.getType() == 'guest'){
      player.getSocket().emit('error', 'You must be logged in to play online');
      return;
    }

    let idRoom = this.addRoom(typeGame);

    if(typeGame == 'test'){
      let playerAI = new Player();

      parametersGame.pathAI = decodeURI(parametersGame.pathAI);
      parametersGame.pathAI = parametersGame.pathAI.replace(':', '/');
      playerAI.setHasAI(player, parametersGame.pathAI);

      if(parametersGame.typeTest == 'Player'){
        this.addPlayer(idRoom, player);
        this.addAI(idRoom, playerAI, parametersGame.color);
      }else if(parametersGame.typeTest == 'AI'){
        //this.addAI(idRoom, player, ai);
        //this.addAI(idRoom, player, ai);
        //TODO Make a standard ai
      }
    }else if (typeGame == 'local'){
      this.addPlayer(idRoom, player);
    }
  }
}