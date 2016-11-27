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
const commandList = require("./commands/index.js");

core.configService.init();
var config = core.configService.getConfig();

core.pluginService.init();

var version = "1.0.0";
var connections = [];
var Id=1;
var debug=false;

var updateMessages = () => {
    io.sockets.emit('get messages', core.chatServer.getMessages());
};
var updateUsernames = () => {
    io.sockets.emit('get players', core.playerServer.getPlayers());
    io.sockets.emit('get id', Id);
};
var updateWorld = () => {
    io.sockets.emit('update world', config);
};
var updatePositions = () => {
    io.sockets.emit('get players', core.playerServer.getPlayers());
};
var ban = () => {
    for(var i=0; i<core.banServer.getBanList().length; i++){
        for(var u=0; u<connections.length; u++){
            if(connections[u].request.client._peername.address===core.banServer.getBanList()[i].ip){
                connections[u].disconnect();
            }
        }
    }
};
var updateEnemies = () => {
    io.sockets.emit('update enemies', core.squareServer.getSquares(), core.triangleServer.getTriangles(), core.pentagonServer.getPentagons());
};
var updateBullets = () => {
    io.sockets.emit('update bullets', core.bulletServer.getBullets());
};

io.on('connection', (socket) => {
    for(var each in core.banServer.getBanList()){
        if(socket.request.client._peername.address === core.banServer.getBanList()[each].ip){ socket.disconnect(); }
    }
    core.pluginService.getPlugins().forEach((plugin) => {
        plugin.call("beforeNewUser");
    });
    connections.push(socket);
    if(debug){ console.log('Connected: %s players connected', connections.length); }
    updateUsernames();
    socket.username = new entities.player("", 0, 0, 0, 0, 5, 1, 0, 0, 40, Id, socket.request.client._peername.address, socket.id);
    core.playerServer.addPlayer(socket.username);
    updateWorld();
    Id+=1;
    ban();
    // Disconnect
    socket.on('disconnect', (data) => {
        if(socket.username !== undefined){
            core.playerServer.getPlayers().splice(core.playerServer.getPlayers().indexOf(socket.username), 1);
            updateUsernames();
        }
        connections.splice(connections.indexOf(socket), 1);
        if(debug){ console.log('Disconnected: %s players connected', connections.length); }
        socket.disconnect();
    });

    //New User
    socket.on('join game', (data, callback) => {
        callback(true);
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].name=data;
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].x = ~~(Math.random() * (config.w-100 - 100 + 1) + 100);
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].y = ~~(Math.random() * (config.h-100 - 100 + 1) + 100);
core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].playing = true;
        updateUsernames();
    });

    //
    socket.on('user update', (r, callback) => {
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].r=r;
    });

    //Send Message
    socket.on('send message', (data) => {
        var cc=true;
        for(var i=0; i<core.muteServer.getMuteList().length; i++){
            if(socket.username.id===core.muteServer.getMuteList()[i]){
                cc=false;
            }
        }
        if(cc){
            entities.chat("all", socket.username.name, data);
        }
    });

    socket.on('player request', () => {
        updateUsernames();
    });

    //Movement
    socket.on('move right', () => {
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].xvel+=0.01;
    });
    socket.on('move left', () => {
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].xvel-=0.01;
    });
    socket.on('move up', () => {
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].yvel-=0.01;
    });
    socket.on('move down', () => {
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].yvel+=0.01;
    });

    //Bullets
    socket.on('new bullet', function(x, y, xd, yd, speed, d, damage, penetration) {
        core.bulletServer.addBullet(new entities.bullet(x, y, xd, yd, speed, d, damage, penetration, socket.username.id));
    });

    socket.on('die', function(callback) {
        callback(true);
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].x = 0;
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].y = 0;
core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].playing = false;
        updateUsernames();
    });
});

var updates = () => {
    if(core.playerServer.getPlayers().length!==0){
        core.pluginService.getPlugins().forEach((plugin) => {
            if(plugin.run){
                plugin.run();
            }
        });
        if(core.squareServer.getSquares().length<config.minimumSquares){
            core.squareServer.addSquare(new entities.square(~~(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 35));
        }
        if(core.triangleServer.getTriangles().length<config.minimumTriangles){
            core.triangleServer.addTriangle(new entities.triangle(~~(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 20));
        }
        if(core.pentagonServer.getPentagons().length<config.minimumPentagons){
            core.pentagonServer.addPentagon(new entities.pentagon(~~(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 60));
        }
        updateEnemies();
        updatePositions();
        updateBullets();
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
    var msg=line.trim().toString().split(" ");
    for (var i in commandList) {
        if(i===msg[0]){
            commandList[i](msg);
        }
    }
    rl.prompt();
}).on('close', () => {
    process.exit(0);
});
console.log("[\x1b[36mReady\x1b[0m] Loading server...");
server.listen(process.env.PORT || config.port, process.env.IP || "0.0.0.0", () => {
    var addr = server.address();
    console.log("");
    console.log("|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|");
    console.log("|              \x1b[32mDiep.io\x1b[0m \x1b[36mPrivate Server\x1b[0m              |");
    console.log("|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|");
    console.log("| Version    : "+version+"                               |");
    console.log("| Status     : In Development                      |");
    console.log("|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|");
    console.log("");
    console.log("[Console] Server running node " + process.version + " On " + addr.address + ":" + addr.port);
    process.title = "diepio private server";
    rl.prompt();
});

exports.ban = ban;
exports.updateMessages = updateMessages;
