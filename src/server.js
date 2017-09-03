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
    commandList = require("./commands/index.js"),
    cp = require('child_process'),
    enemyServer = cp.fork('./core/enemyServer.js');
router.use(express.static(path.resolve(__dirname, 'client')));

var squares = [],
    triangles = [],
    pentagons = [];
enemyServer.on('message', m => {
    if(m.type === 'send') {
        if(m.call === 'sendSquares') {
            squares = m.data;
            updateEnemies();
        }
        if(m.call === 'sendTriangles') {
            triangles = m.data;
            updateEnemies();
        }
        if(m.call === 'sendPentagons') {
            pentagons = m.data;
            updateEnemies();
        }
    }
});

core.configService.init(); // Init Config Service

var config = core.configService.getConfig(),
    connections = [],
    Id=1;

enemyServer.send({type: 'send', call: 'config', data: config}); // Send config Data to Enemy Server

core.pluginService.init(); // Init Plugin Service

var updateMessages = () => io.sockets.emit('get messages', core.chatServer.getMessages()),
  	updateUsernames = () => {
    		io.sockets.emit('get players', core.playerServer.getPlayers());
    		io.sockets.emit('get id', Id);
  	},
  	updateWorld = () => io.sockets.emit('update world', config),
  	updatePositions = () => io.sockets.emit('get players', core.playerServer.getPlayers()),
  	ban = () => {
    		core.banServer.getBanList().forEach(ban => {
            for (var u = 0; u < connections.length; u++) if (connections[u].request.client._peername.address === ban.ip) connections[u].disconnect();
    		});
  	},
  	updateEnemies = () => io.sockets.emit('update enemies', squares, triangles, pentagons),
  	updateBullets = () => io.sockets.emit('update bullets', core.bulletServer.getBullets());

io.on('connection', socket => {
    for(var each in core.banServer.getBanList()) if(socket.request.client._peername.address === core.banServer.getBanList()[each].ip) socket.disconnect();
    core.pluginService.getPlugins().forEach(plugin => plugin.call("beforeNewUser"));
    connections.push(socket);
    socket.username = new entities.player("", 0, 0, Id, socket.request.client._peername.address, socket.id);
    core.playerServer.addPlayer(socket.username);
    updateUsernames();
    updateWorld();

    socket.on('disconnect', data => {
        if(socket.username !== undefined){
            core.playerServer.getPlayers().splice(core.playerServer.getPlayers().indexOf(socket.username), 1);
            updateUsernames();
        }
        connections.splice(connections.indexOf(socket), 1);
    });

    socket.on('join game', (data, callback) => {
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
        if(cc) entities.chat('all', socket.username.name, data)
        else entities.chat(socket.username.id, '[Server]', 'You are muted and cannot chat!')
    });

    socket.on('new bullet', (x, y, xd, yd) => core.bulletServer.addBullet(new entities.bullet(x, y, xd, yd, socket.username.id)));
});

var updates = () => {
    if (core.playerServer.getPlayers().length == 0) return;
    core.pluginService.getPlugins().forEach(plugin => {
        if(plugin.run) plugin.run();
    });
    core.playerServer.getPlayers().forEach(player => player.update());
    core.bulletServer.getBullets().forEach(bullet => bullet.update());
    core.physics.collisions();
    updatePositions();
    updateBullets();
};
var interval = setInterval(updates, 1000/config.fps);
console.log("[\x1b[34mINFO\x1b[0m] Loading server...");
server.listen(process.env.PORT || config.port, process.env.IP || "0.0.0.0", () => {
    console.log(`[\x1b[36mConsole\x1b[0m] Server running node ${process.version} On port ${server.address().port}`);
    process.title = "diepio private server";
    var cmds = new asyncconsole(' > ', data => {
        var msg = data.trim().toString().split(" ");
        for (var i in commandList) if(i === msg[0]) commandList[i](msg);
    });
});

exports.ban = ban;
exports.updateMessages = updateMessages;
exports.Id = () => {return Id};
exports.setId = id => Id = id;
exports.enemyServer = enemyServer;
exports.getConfig = () => {return config};
exports.getSquares = () => {return squares};
exports.getTriangles = () => {return triangles};
exports.getPentagons = () => {return pentagons};
exports.removeSquare = index => enemyServer.send({type: 'remove', call: 'removeASquare', data: index});
exports.removeTriangle = index => enemyServer.send({type: 'remove', call: 'removeATriangle', data: index});
exports.removePentagon = index => enemyServer.send({type: 'remove', call: 'removeAPentagon', data: index});
exports.setSquares = data => enemyServer.send({type: 'set', call: 'setSquares', data: data});
exports.setTriangles = data => enemyServer.send({type: 'set', call: 'setTriangles', data: data});
exports.setPentagons = data => enemyServer.send({type: 'set', call: 'setPentagons', data: data});
