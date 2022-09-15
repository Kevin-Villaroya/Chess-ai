const Player = require('../model/Player');
const Room = require('../model/Room');
const db = require('../../dbAccess/dbAccess');

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

  addPlayer(id, player){
    this.rooms[id].addPlayer(player);
  }

  getAvailableId(){
    let id = Math.random().toString(36).slice(2);

		while (this.rooms.includes(id)){
			id = Math.random().toString(36).slice(2);
		}

		return id;
  }

  listen(){
    this.io.on('connection', async (socket) => {
      let player = new Player();
      player.socket = socket;

      socket.on('play', async (typeGame, idSession) => {
        let playerDB = await db.getUserBySession(idSession);

        if(playerDB != null || playerDB != undefined){
          player.initByDatabase(playerDB);
        }

        this.onPlay(typeGame, player);
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

    /** SOCKET TREATMENT **/

  onPlay(typeGame, player){
    if(typeGame != 'local' && player.getType() == 'guest'){
      player.getSocket().emit('error', 'You must be logged in to play online');
      return;
    }

    let idRoom = this.addRoom(typeGame);

    if(typeGame == 'test'){
      this.rooms[idRoom].addAI(player);
      this.rooms[idRoom].addPlayer(player);
    }else if (typeGame == 'local'){
      this.addPlayer(idRoom, player);
    }
  }
}