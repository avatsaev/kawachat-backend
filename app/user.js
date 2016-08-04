
var chat  = require("./chat")
var _ = require("lodash")

class User{

  constructor({socket = null, client_id=null, username="", frq="1" } = {}){
    this.client_id = client_id;
    this.socket = socket;
    this.username  = username;
    this.frq = frq;
  }

  get_room(){
    return  _.find(chat.rooms, (r) => { return r.frq == this.frq });
  }

  as_json(){

    return {
      username: this.username,
      frq: this.frq
    }
    
  }

}

module.exports = User
