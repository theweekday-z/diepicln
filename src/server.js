'use strict';
const http = require('http');
const path = require('path');
const readline = require('readline');

const socketio = require('socket.io');
const express = require('express');

const router = express();
const server = http.createServer(router);
const io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

const core = require("./core/index.js");
const entities = require("./entities/index.js");
const commandList = require("./modules/commandList.js");

core.configService.init();

var config = core.configService.getConfig();

var connections = [];
var Id=1;
var debug=true;

var updateMessages = function(){
    io.sockets.emit('get messages', core.chatServer.getMessages());
};
var updateUsernames = function(){
    io.sockets.emit('get players', core.playerServer.getPlayers());
    io.sockets.emit('get id', Id);
};
var updateWorld = function() {
    io.sockets.emit('update world', config);
};
var updatePositions = function(){
    io.sockets.emit('get players', core.playerServer.getPlayers());
};
var ban = function(){
  for(var i=0; i<core.banServer.getBanList().length; i++){
      for(var u=0; u<core.playerServer.getPlayers().length; u++){
          if(core.playerServer.getPlayers()[u].ip===core.banServer.getBanList()[i].ip){
              io.sockets.emit('banned', core.playerServer.getPlayers()[i].ip);
          }
      }
  }
};
var updateEnemies = function() {
    io.sockets.emit('update enemies', core.squareServer.getSquares(), core.triangleServer.getTriangles(), core.pentagonServer.getPentagons());
};
var updateBullets = function() {
    io.sockets.emit('update bullets', core.bulletServer.getBullets());
};

io.on('connection', function (socket) {
    connections.push(socket);
    if(debug){ console.log('Connected: %s players connected', connections.length); }
    updateUsernames();
    socket.username = new entities.player("", 0, 0, 0, 0, 5, 1, 0, 0, 40, Id, "");
    core.playerServer.addPlayer(socket.username);
    updateWorld();
    Id+=1;
    ban();

    // Disconnect
    socket.on('disconnect', function(data){
        if(socket.username !== undefined){
            core.playerServer.getPlayers().splice(core.playerServer.getPlayers().indexOf(socket.username), 1);
            updateUsernames();
        }
        connections.splice(connections.indexOf(socket), 1);
        if(debug){ console.log('Disconnected: %s players connected', connections.length); }
    });

    //New User
    socket.on('new user', function(data, Ip, callback){
        callback(true);
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].name=data;
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].ip = Ip;
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].x = ~~(Math.random() * (config.w-100 - 100 + 1) + 100);
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].y = Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100);
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].ip = Ip;
        updateUsernames();
    });

    //
    socket.on('user update', function(r, callback){
        var players = core.playerServer.getPlayers();
        players[players.indexOf(socket.username)].r=r;
        core.playerServer.setPlayers(players);
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
            entities.chat("all", socket.username.name, data);
        }
    });

    //Movement
    socket.on('move right', function(){
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].xvel+=0.01;
    });
    socket.on('move left', function(){
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].xvel-=0.01;
    });
    socket.on('move up', function(){
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].yvel-=0.01;
    });
    socket.on('move down', function(){
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].yvel+=0.01;
    });

    //Bullets
    socket.on('new bullet', function(x, y, xd, yd, speed, d, damage, penetration) {
        core.bulletServer.addBullet(new entities.bullet(x, y, xd, yd, speed, d, damage, penetration, socket.username.id));
    });
});

var updates = function(){
    if(core.squareServer.getSquares().length<config.minimumSquares){
        core.squareServer.addSquare(new entities.square(~~(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 35));
    }
    if(core.triangleServer.getTriangles().length<config.minimumTriangles){
        core.triangleServer.addTriangle(new entities.triangle(~~(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 20));
    }
    if(core.pentagonServer.getPentagons().length<config.minimumPentagons){
        core.pentagonServer.addPentagon(new entities.pentagon(~~(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 60));
    }
    if(core.playerServer.getPlayers().length!==0){
        ban();
        updateEnemies();
        updatePositions();
        updateBullets();
        updateMessages();
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
        for(var i=0; i<core.bulletServer.getBullets().length; i++){
            core.bulletServer.getBullets()[i].update();
        }
    }
};
setInterval(updates, 1000/config.fps);

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
try{
server.listen(process.env.PORT || config.port, process.env.IP || "0.0.0.0", function(){
      var addr = server.address();
      console.log("[Console] Server running On ", addr.address + ":" + addr.port);
});
} catch(e){
    switch (e.code) {
        case "EADDRINUSE":
          console.log("[Error] Server could not bind to port! Please close out of Skype or change 'serverPort' in src/settings to a different number.");
          break;
    }
}
