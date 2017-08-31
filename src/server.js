'use strict';
const https = require('https'),
    path = require('path'),
    asyncconsole = require('asyncconsole'),
    socketio = require('socket.io'),
    express = require('express'),
    router = express(),
    server = require('http').createServer(router),
    io = socketio.listen(server),
    core = require("./core/index.js"),
    entities = require("./entities/index.js"),
    commandList = require("./commands/index.js");
router.use(express.static(path.resolve(__dirname, 'client')));

core.configService.init();
var config = core.configService.getConfig();
core.pluginService.init();

var version = "1.0.0",
    connections = [],
    Id=1;

var updateIds = () => {
    Id += 1;
    exports.Id = Id;
};
var updateMessages = () => io.sockets.emit('get messages', core.chatServer.getMessages());
var updateUsernames = () => {
    io.sockets.emit('get players', core.playerServer.getPlayers());
    io.sockets.emit('get id', Id);
};
var updateWorld = () => io.sockets.emit('update world', config);
var updatePositions = () => io.sockets.emit('get players', core.playerServer.getPlayers());
var ban = () => {
    core.banServer.getBanList().forEach(ban => {
        for(var u=0; u<connections.length; u++) if(connections[u].request.client._peername.address===ban.ip) connections[u].disconnect();
    });
};
var updateEnemies = () => io.sockets.emit('update enemies', core.squareServer.getSquares(), core.triangleServer.getTriangles(), core.pentagonServer.getPentagons());
var updateBullets = () => io.sockets.emit('update bullets', core.bulletServer.getBullets());

io.on('connection', socket => {
    for(var each in core.banServer.getBanList()) if(socket.request.client._peername.address === core.banServer.getBanList()[each].ip) socket.disconnect();
    core.pluginService.getPlugins().forEach(plugin => plugin.call("beforeNewUser"));
    connections.push(socket);
    updateUsernames();
    socket.username = new entities.player("", 0, 0, Id, socket.request.client._peername.address, socket.id);
    core.playerServer.addPlayer(socket.username);
    updateWorld();
    updateIds();

    socket.on('disconnect', (data) => {
        if(socket.username !== undefined){
            core.playerServer.getPlayers().splice(core.playerServer.getPlayers().indexOf(socket.username), 1);
            updateUsernames();
        }
        connections.splice(connections.indexOf(socket), 1);
    });

    socket.on('join game', (data, callback) => {
        callback(true);
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].name=data;
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].x = ~~(Math.random() * (config.w-100 - 100 + 1) + 100);
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].y = ~~(Math.random() * (config.h-100 - 100 + 1) + 100);
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].playing = true;
        updateUsernames();
        updateMessages();
    });

    socket.on('user update', (r, km) => {
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].r=r;
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].keyMap = km;
    });

    socket.on('start chatting', () => core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].chatting = true);

    socket.on('stop chatting', () => core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.username)].chatting = false);

    socket.on('send message', data => {
        var cc=true;
        for(var i=0; i<core.muteServer.getMuteList().length; i++) if(socket.username.id===core.muteServer.getMuteList()[i]) cc=false;
        if(cc) entities.chat("all", socket.username.name, data);
    });

    socket.on('new bullet', (x, y, xd, yd, speed, d, damage, penetration) => core.bulletServer.addBullet(new entities.bullet(x, y, xd, yd, speed, d, damage, penetration, socket.username.id)));
});

var updates = () => {
    if (core.playerServer.getPlayers().length == 0) return;
    core.pluginService.getPlugins().forEach(plugin => {
        if(plugin.run) plugin.run();
    });
    if (core.squareServer.getSquares().length<config.minimumSquares) core.squareServer.addSquare(new entities.square(~~(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 35));
    if (core.triangleServer.getTriangles().length<config.minimumTriangles) core.triangleServer.addTriangle(new entities.triangle(~~(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 20));
    if (core.pentagonServer.getPentagons().length<config.minimumPentagons) core.pentagonServer.addPentagon(new entities.pentagon(~~(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 60));
    core.squareServer.getSquares().forEach(square => square.update());
    core.triangleServer.getTriangles().forEach(triangle => triangle.update());
    core.pentagonServer.getPentagons().forEach(pentagon => pentagon.update());
    core.playerServer.getPlayers().forEach(player => player.update());
    core.bulletServer.getBullets().forEach(bullet => bullet.update());
    core.physics.collisions();
    updateEnemies();
    updatePositions();
    updateBullets();
};
var interval = setInterval(updates, 1000/config.fps);
console.log("[\x1b[36mReady\x1b[0m] Loading server...");
server.listen(process.env.PORT || config.port, process.env.IP || "0.0.0.0", () => {
    console.log("[Console] Server running node " + process.version + " On " + server.address().address + ":" + server.address().port);
    process.title = "diepio private server";
    var cmds = new asyncconsole(' > ', data => {
        var msg = data.trim().toString().split(" ");
        for (var i in commandList) if(i === msg[0]) commandList[i](msg);
    });
});

exports.ban = ban;
exports.updateMessages = updateMessages;
exports.Id = Id;
exports.updateIds = updateIds;
