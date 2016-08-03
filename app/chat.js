var Room  = require("./room")

var _ = require("lodash")

let chat = {
  socket: undefined,
  people: [],
  rooms: [],
  state: "ready"
}


chat.get_room = function(frq) {
  console.log(chat.rooms);
  console.log(chat.people);
  return _.find(chat.rooms, r => {return r.frq == "1"} )
}

chat.add_room = function(frq) {

  room = chat.get_room();

  if(room == undefined){
    room = new Room(frq);
    chat.rooms.push(room);
  }

  return room;

}

chat.remove_room = function(frq){
  _.remove(chat.rooms, {
    frq: frq
  });
}

module.exports = chat
