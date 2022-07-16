const Player = require('../model/Player');
const Room = require('../model/Room');

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
    this.io.on('connection', (socket) => { 
      console.log('RoomManager: a user is connected');

      let player = null;

      socket.on('play', (typeGame, idPlayer) => {
        player = new Player(idPlayer, socket);
        this.onPlay(typeGame, player);
      });

      socket.on('disconnect', () => {
          console.log('RoomManager: user disconnected');

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
    this.rooms[idRoom].addPlayer(player);
  }
}