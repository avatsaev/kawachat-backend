var chat  = require("./chat")
var _ = require("lodash")

function tumbler(frq, event, client, params){

  users = _.filter(chat.people, function(user){return user.frq==frq})

  if(event=="update"){

    users.forEach(function(user){
      if(user.client_id != client.id){
        chat.socket.sockets.sockets[user.client_id].emit("update", params.msg);
      }
    });

  }

  if(event=="chat"){

    users.forEach(function(user){
      if(user.client_id != client.id){
        chat.socket.sockets.sockets[user.client_id].emit("chat", user.username, params.msg);
      }
    });

  }

  if(event=="update-people"){

    msg = "---Users on this frequency: ";

    users.forEach(function(user){
      msg=msg+"/"+user.username+"/ - "
    });

    users.forEach(function(user){
      chat.socket.sockets.sockets[user.client_id].emit("update", msg);
      console.log("user_join")
      console.log(params.user)
      chat.socket.sockets.sockets[user.client_id].emit("user_join", {user: params.user});
    });

  }

  if(event=="broadcast"){
    chat.socket.sockets.emit("update", params.msg);
  }
}


module.exports = tumbler
