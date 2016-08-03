var port = process.env.PORT || 3002;
var env = process.env.NODE_ENV || "development";

var http = require('http')
var chat  = require("./app/chat")
var tumbler = require("./app/tumbler")
var Room = require("./app/room")


var _ = require("lodash");
// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end("");
});


// Socket.io server listens to our app
var socket = require('socket.io').listen(app);
socket.set( 'origins','*:*')

chat.socket = socket;


socket.on("connection", function (client) {

  client.on("join", function(data){

    var userData = data;

    user = {}

    if (userData["username"]==undefined || userData["username"]=="") {
      user.username="User_"+Math.floor(Math.random()*110000);
    }

    if (userData["frq"]==undefined || userData["frq"]=="") {
      user.frq="1";
    }

    user.username = escapeHtml(userData["username"]).substring(0, 20);
    user.frq = escapeHtml(userData["frq"]).substring(0, 32);



    if(user.frq == "haltOff") chat.state="ready";

    else if(user.frq == "haltOn"){
      chat.state="halted";
      tumbler(null, "broadcast",null, {msg: "---System broadcast: server and frequency tumblers temporarily are halted, stand by..."});
    }

    if(chat.state=="halted"){
      client.emit("update", "Connection refused: server and frequency tumblers are temporarily halted...");
      return;
    }

    user.client_id = client.id


    //console.dir("frequency: "+userData["frq"]);
    //console.dir("user: "+userData["username"]);

    //chat.people[client.id] = userData;
    chat.people.push(user)
    r = chat.add_room(user.frq)
    console.log("room: ", r.people());
    console.log('people: ', chat.people);

    client.emit("update", "Welcome. You have connected to the server on the frequency "+user.frq+" MHz");

    tumbler(user.frq, "update", client, {msg: (user.username+" has joined the server on the frequency "+user.frq+" MHz") });

    tumbler(user.frq, "update-people", client, {user: user});

    tumbler(null, "broadcast",null, {msg: "---System broadcast: "+chat.people.length+" users connected on server."});

  });

  client.on("send", function(data){

    if(chat.state=="halted"){
      client.emit("update", "ERROR: Server and frequency tumblers are halted...");
      return;
    }

    var inData = data;

    if(inData["msg"]==undefined || inData["msg"]=="" || inData["frq"]==undefined || inData["frq"]=="") return;


    inData["frq"]= escapeHtml(inData["frq"]).substring(0, 32);
    inData["msg"]= escapeHtml(inData["msg"]).substring(0, 512);
    inData["usr"]= escapeHtml(inData["usr"]).substring(0, 64);


    tumbler(inData["frq"], "chat", client, {msg:inData["msg"], usr: inData["usr"] });


  });

  client.on("disconnect", function(){

    user = _.find(chat.people, {client_id: client.id})

    if(user){
      tumbler(user.frq, "update", client, { msg: (user.username + " left the frequency "+user.frq+" MHz") } );
      _.remove(chat.people, {client_id: user.client_id})

    }

  });
});


function escapeHtml(text) {

  if(text==undefined){
    return;
  }

  return text.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

console.log("---------- server running on port "+port+" -----------------")
app.listen(port);
