let chat  = require("./chat")
const _ = require("lodash")

function tumbler(frq, event, params){

  if(frq){
    room = chat.get_room(frq);
    users = room.people();
  }


  if(event=="update"){
    room.system_msg(params.msg);
  }

  if(event=="chat"){
    room.send_msg(params.msg, params.usr);
  }

  if(event=="broadcast"){
    chat.broadcast(msg);
  }

  if (event=="error"){
    params.client.emit("err", {errno: params.errno, msg: params.msg})
  }
}

module.exports = tumbler
