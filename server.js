var http = require('http');
var path = require('path');

var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

var settings = require("./settings.json");
var world = settings.world;

var users = [];
var connections = [];
var messages = [];
var Id=1;
var debug=false;
var chatBanList=[];
var banList=[];

var updateMessages;
var updateUsernames;
var updateWorld;
var updatePositions;
var ban;
var updateEnemies;
var updatingStarted = false;

var squares = [];
var triangles = [];
var pentagons = [];
var bullets = [];


io.on('connection', function (socket) {
    connections.push(socket);
    if(debug){ console.log('Connected: %s users connected', connections.length); }

    // Disconnect
    socket.on('disconnect', function(data){
        if(socket.username !== undefined){
            users.splice(users.indexOf(socket.username), 1);
            updateUsernames();
        }
        connections.splice(connections.indexOf(socket), 1);
        if(debug){ console.log('Connected: %s users connected', connections.length); }
    });

    //New User
    socket.on('new user', function(data, Ip, callback){
        callback(true);
        socket.username = {name: data, x: Math.floor(Math.random() * (world.w-100 - 100 + 1) + 100), y: Math.floor(Math.random() * (world.h-100 - 100 + 1) + 100), xvel: 0, yvel: 0, moving: false, lvl: 1, score: 0, r: 0, d: 40, id: Id, ip: Ip};
        users.push(socket.username);
        updateUsernames();
        updateWorld();
        updateMessages();
        Id+=1;
        ban();
    });

    //
    socket.on('user update', function(r, callback){
        users[users.indexOf(socket.username)].r=r;
        updatePositions();
    });

    //Send Message
    socket.on('send message', function(data){
        var cc=true;
        for(var i=0; i<chatBanList.length; i++){
            if(socket.username.id===chatBanList[i]){
                cc=false;
            }
        }
        if(cc){
            var message = {msg: data, user: socket.username.name, to: "all"};
            messages.push(message);
            updateMessages();
        }
    });

    //Movement
    socket.on('move right', function(){
        users[users.indexOf(socket.username)].moving=true;
        users[users.indexOf(socket.username)].xvel+=0.01;
    });
    socket.on('move left', function(){
        users[users.indexOf(socket.username)].moving=true;
        users[users.indexOf(socket.username)].xvel-=0.01;
    });
    socket.on('move up', function(){
        users[users.indexOf(socket.username)].moving=true;
        users[users.indexOf(socket.username)].yvel-=0.01;
    });
    socket.on('move down', function(){
        users[users.indexOf(socket.username)].moving=true;
        users[users.indexOf(socket.username)].yvel+=0.01;
    });
    socket.on('stop moving', function(){
        users[users.indexOf(socket.username)].moving=false;
    });

    updateUsernames = function(){
        io.sockets.emit('get users', users);
        io.sockets.emit('get id', Id);
    };
    updatePositions = function(){
        for(var i=0; i<users.length; i++){
            if(users[i].x>world.w){
                users[i].x=world.w;
            }
            if(users[i].y>world.h){
                users[i].y=world.h;
            }
            if(users[i].x<0){
                users[i].x=0;
            }
            if(users[i].y<0){
                users[i].y=0;
            }
        }
        io.sockets.emit('get users', users);
    };
    updateMessages = function(){
        io.sockets.emit('get messages', messages);
    };
    updateWorld = function() {
        io.sockets.emit('update world', world);
    };
    ban = function(){
      for(var i=0; i<banList.length; i++){
          for(var u=0; u<users.length; u++){
              if(users[u].ip===banList[i].ip){
                  io.sockets.emit('banned', users[i].ip);
              }
          }
      }
    };
    updateEnemies = function() {
        io.sockets.emit('update enemies', squares, triangles, pentagons);
    };
    if(updatingStarted===false){
        setInterval(updateEnemies, 0);
    }
});
var dist = function(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;

    var c = Math.sqrt( a*a + b*b );

    return c;
};
var collideWith = function(e, c) {
    if (dist(e.x, e.y, c.x, c.y) - (e.d / 2) < c.d / 2) {
        return true;
    } else {
        return false;
    }

};
var collisions = function() {
    for(var u=0; u<users.length; u++){
        /* Squares Collisions */
        for(var i=0; i<squares.length; i++){
            if (collideWith(users[u], squares[i])) {
                if(users[u].x>squares[i].x){
                    users[u].x-=1;
                    squares[i].x+=10;
                }
                if(users[u].x<squares[i].x+squares[i].d){
                    users[u].x+=1;
                    squares[i].x-=10;
                }
                if(users[u].y>squares[i].y){
                    users[u].y-=1;
                    squares[i].y+=10;
                }
                if(users[u].y<squares[i].y+squares[i].d){
                  users[u].y+=1;
                  squares[i].y-=10;
                }
            }
        }
        /* Triangles Collisions */
        for(var i=0; i<triangles.length; i++){
            if (collideWith(users[u], triangles[i])) {

            }
        }
        /* Pentagons Collisions */
        for(var i=0; i<pentagons.length; i++){
            if (collideWith(users[u], pentagons[i])) {

            }
        }
    }
};
var updates = function(){
    if(users.length!==0){
        if(squares.length<world.minimumSquares){
            squares.push({x: Math.floor(Math.random() * (world.w-100 - 100 + 1) + 100), y: Math.floor(Math.random() * (world.h-100 - 100 + 1) + 100), r: Math.floor(Math.random() * (360 - 0 + 1) + 0), d: 35})
        }
        if(triangles.length<world.minimumTriangles){
            triangles.push({x: Math.floor(Math.random() * (world.w-100 - 100 + 1) + 100), y: Math.floor(Math.random() * (world.h-100 - 100 + 1) + 100), r: Math.floor(Math.random() * (360 - 0 + 1) + 0), d: 20})
        }
        if(pentagons.length<world.minimumPentagons){
            pentagons.push({x: Math.floor(Math.random() * (world.w-100 - 100 + 1) + 100), y: Math.floor(Math.random() * (world.h-100 - 100 + 1) + 100), r: Math.floor(Math.random() * (360 - 0 + 1) + 0), d: 60})
        }
        for(var i=0; i<squares.length; i++){
            squares[i].r+=0.00025;
        }
        for(var i=0; i<triangles.length; i++){
            triangles[i].r+=0.00025;
        }
        for(var i=0; i<pentagons.length; i++){
            pentagons[i].r+=0.00025;
        }
        collisions();
        for(var i=0; i<users.length; i++){
            users[i].x+=users[i].xvel;
            users[i].y+=users[i].yvel;
            if(!users[i].moving){
                users[i].xvel/=1.05;
                users[i].yvel/=1.05;
            } else {
                if(users[i].xvel > 1){
                    users[i].xvel = 1;
                }
                if(users[i].yvel > 1){
                    users[i].yvel = 1;
                }
                if(users[i].xvel < -1){
                    users[i].xvel = -1;
                }
                if(users[i].yvel < -1){
                    users[i].yvel = -1;
                }
            }
        }
        updatePositions();
    }
};
setInterval(updates, 0);

var chat = function(to, msg){
    if(to==="all"){
        var message = {msg: msg, user: "[Server]", to: "all"};
        messages.push(message);
        updateMessages();
        console.log("Message Sent To All!");
    } else {
        var message = {msg: msg, user: "[Server]", to: to};
        messages.push(message);
        updateMessages();
        console.log("Message Sent To "+to);
    }
};

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ' > '
});

rl.on('line', (line) => {
    var l=line.trim();
    var msg=l.split(" ");
    switch(msg[0]){
        case "playerlist":
            console.log("Users: ");
            for(var i=0; i<users.length; i++){
                console.log("|" + "ID: " + users[i].id + " | " + "Name: " + users[i].name + " | " + "x: " + users[i].x + " | "+ "y: " + users[i].y + " | " + "IP: " + users[i].ip);
            }
            break;

        case "name":
            var nameW=[];
            for(var i=2; i<msg.length; i++){
                nameW.push(msg[i]);
            }
            for(var i=0; i<users.length; i++){
                if(users[i].id===parseInt(msg[1])){
                  users[i].name=nameW;
                  updateUsernames();
                  console.log("Changed player "+parseInt(msg[1])+"'s name to "+users[i].name);
                }
            }
            break;

        case "chat":
            var messageW=[];
            for(var i=2; i<msg.length; i++){
                messageW.push(msg[i]);
            }
            chat(msg[1], messageW.join(" "));
            break;

        case "chatBan":
            var cb=false;
            for(var i=0; i<users.length; i++){
                if(parseInt(msg[1])===users[i].id){ cb=true; }
            }
            for(var i=0; i<chatBanList.length; i++){
                if(parseInt(msg[1])===chatBanList[i]){ cb=false; }
            }
            if(cb){
                chatBanList.push(parseInt(msg[1]));
                var message = {msg: "You Have Been Banned From Chatting.", user: "[Server]", to: parseInt(msg[1])};
                messages.push(message);
                updateMessages();
                console.log("Banned Player "+parseInt(msg[1])+" From Chatting.");
            } else {
                console.log("Failed To Ban Player "+parseInt(msg[1])+" From Chatting.");
            }
            break;

        case "chatBanList":
            console.log(chatBanList);
            break;

        case "removeChatBan":
            for(var i=0; i<chatBanList.length; i++){
                if(parseInt(msg[1])===chatBanList[i]){
                    chatBanList.splice(i, 1);
                    var message = {msg: "You Have Been Unbanned From Chatting.", user: "[Server]", to: parseInt(msg[1])};
                    messages.push(message);
                    updateMessages();
                    console.log("Unbanned Player "+parseInt(msg[1])+" From Chatting.");
                }
            }
            break;

        case "ban":
            var cb=true;
            for(var i=0; i<banList.length; i++){
                if(msg[1]===banList[i].ip){ cb=false; }
            }
            console.log(cb);
            if(cb){
                for(var i=0; i<users.length; i++){
                    if(users[i].ip===msg[1]){
                        banList.push({ip: users[i].ip});
                        console.log("Banned Player "+msg[1]);
                        ban();
                    }
                }
            } else {
                console.log("Failed To Ban Player "+msg[1]);
            }
            break;

        case "unBan":
            for(var i=0; i<banList.length; i++){
                if(msg[1]===banList[i].ip){
                    banList.splice(i, 1);
                    console.log("Unbanned IP "+msg[1]);
                }
            }
            break;

        case "banList":
            console.log("Banned Users:");
            console.log(banList);
            break;
    }
    rl.prompt();
}).on('close', () => {
  console.log('Bye!');
  process.exit(0);
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server running On ", addr.address + ":" + addr.port);
  rl.prompt();
});
