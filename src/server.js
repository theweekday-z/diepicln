'use strict';
var http = require('http');
var path = require('path');

var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

const fs = require("fs");

const core = require("./core/index.js");
const entities = require("./entities/index.js");
const commandList = require("./modules/commandList.js");

core.configService.init();

var config = core.configService.getConfig();

var players = core.playerServer.getPlayers();
var connections = [];
var Id=1;
var debug=true;
var chatBanList=[];

var updateMessages = function(){
    io.sockets.emit('get messages', core.chatServer.getMessages());
};
var updateUsernames = function(){
    io.sockets.emit('get players', players);
    io.sockets.emit('get id', Id);
};
var updateWorld = function() {
    io.sockets.emit('update world', config);
};
var updatePositions = function(){
    for(var i=0; i<players.length; i++){
        if(players[i].x>config.w){
            players[i].x=config.w;
        }
        if(players[i].y>config.h){
            players[i].y=config.h;
        }
        if(players[i].x<0){
            players[i].x=0;
        }
        if(players[i].y<0){
            players[i].y=0;
        }
    }
    io.sockets.emit('get players', players);
};;
var ban = function(){
  for(var i=0; i<core.banServer.getBanList().length; i++){
      for(var u=0; u<players.length; u++){
          if(players[u].ip===core.banServer.getBanList()[i].ip){
              io.sockets.emit('banned', players[i].ip);
          }
      }
  }
};
var updateEnemies = function() {
    io.sockets.emit('update enemies', core.squareServer.getSquares(), core.triangleServer.getTriangles(), core.pentagonServer.getPentagons());
};
var updateBullets = function() {
    io.sockets.emit('update bullets', bullets);
};

var squares = [];
var triangles = [];
var pentagons = [];
var bullets = core.bulletServer.getBullets();

var superAwesomeUpdates = function() {
    if(players !== core.playerServer.getPlayers()){
        core.playerServer.setPlayers(players);
    }
    if(bullets !== core.bulletServer.getBullets()){
        core.bulletServer.setBullets(bullets);
    }
};
setInterval(superAwesomeUpdates, 0);

io.on('connection', function (socket) {
    connections.push(socket);
    if(debug){ console.log('Connected: %s players connected', connections.length); }

    // Disconnect
    socket.on('disconnect', function(data){
        if(socket.username !== undefined){
            players.splice(players.indexOf(socket.username), 1);
            updateUsernames();
        }
        connections.splice(connections.indexOf(socket), 1);
        if(debug){ console.log('Disconnected: %s players connected', connections.length); }
    });

    //New User
    socket.on('new user', function(data, Ip, callback){
        callback(true);
        socket.username = new entities.player(data, Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), 0, 0, false, 1, 0, 0, 40, Id, Ip);
        core.playerServer.addPlayer(socket.username);
        updateUsernames();
        updateWorld();
        Id+=1;
        ban();
    });

    //
    socket.on('user update', function(r, callback){
        players[players.indexOf(socket.username)].r=r;
    });

    //Send Message
    socket.on('send message', function(data){
        var cc=true;
        for(var i=0; i<core.chatBanServer.getChatBanList().length; i++){
            if(socket.username.id===core.chatBanServer.getChatBanList()[i]){
                cc=false;
            }
        }
        if(cc){
            entities.chat("all", socket.username.name, data)
        }
    });

    //Movement
    socket.on('move right', function(){
        players[players.indexOf(socket.username)].moving=true;
        players[players.indexOf(socket.username)].xvel+=0.01;
    });
    socket.on('move left', function(){
        players[players.indexOf(socket.username)].moving=true;
        players[players.indexOf(socket.username)].xvel-=0.01;
    });
    socket.on('move up', function(){
        players[players.indexOf(socket.username)].moving=true;
        players[players.indexOf(socket.username)].yvel-=0.01;
    });
    socket.on('move down', function(){
        players[players.indexOf(socket.username)].moving=true;
        players[players.indexOf(socket.username)].yvel+=0.01;
    });
    socket.on('stop moving', function(){
        players[players.indexOf(socket.username)].moving=false;
    });

    //Bullets
    socket.on('new bullet', function(x, y, xd, yd, speed, d, damage, penetration) {
        bullets.push(new entities.bullet(x, y, xd, yd, speed, d, damage, penetration));
    });
});

var sendStuff = function() {
    ban();
    updateEnemies()
    updatePositions();
    updateBullets();
    updateMessages();
};
setInterval(sendStuff, 1000/config.fps);

var updates = function(){
    if(core.squareServer.getSquares().length<config.minimumSquares){
        core.squareServer.addSquare(new entities.square(Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 35));
    }
    if(core.triangleServer.getTriangles().length<config.minimumTriangles){
        core.triangleServer.addTriangle(new entities.triangle(Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 20));
    }
    if(core.pentagonServer.getPentagons().length<config.minimumPentagons){
        core.pentagonServer.addPentagon(new entities.pentagon(Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 60));
    }
    if(players.length!==0){
        for(var i=0; i<core.squareServer.getSquares().length; i++){
            core.squareServer.getSquares()[i].update();
        }
        for(var i=0; i<core.triangleServer.getTriangles().length; i++){
            core.triangleServer.getTriangles()[i].update();
        }
        for(var i=0; i<core.pentagonServer.getPentagons().length; i++){
            core.pentagonServer.getPentagons()[i].update();
        }
        for(var i=0; i<core.playerServer.getPlayers().length; i++){
            core.playerServer.getPlayers()[i].update();
        }
        for(var i=0; i<bullets.length; i++){
            bullets[i].update();
        }
    }
};
setInterval(updates, 1000/config.fps);
//setInterval(updates, 0); // Running This Speeds Everything Up, But Creates A Memory leak

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ' > '
});

rl.on('line', (line) => {
    var l=line.trim();
    l = l.toString();
    var msg=l.split(" ");
    for (var i in commandList) {
        if(i===msg[0]){
            commandList[i](msg);
        }
    }
    rl.prompt();
}).on('close', () => {
  console.log('Bye!');
  process.exit(0);
});
server.listen(process.env.PORT || config.port, process.env.IP || "0.0.0.0", function(){
    var addr = server.address();
      console.log("[Console] Server running On ", addr.address + ":" + addr.port);
});
