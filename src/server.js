const express = require('express'),
    router = express(),
    server = require('http').createServer(router),
    io = require('socket.io').listen(server),
    core = require("./core/index.js"),
    entities = require("./entities/index.js"),
    commandList = require("./commands/index.js"),
    enemyServer = require('child_process').fork('./core/enemyServer.js');
router.use(express.static(require('path').resolve(__dirname, 'client'))); // Set client directory
core.pluginService.init(); // Init Plugin Service
core.configService.init(); // Init Config Service
var config = core.configService.getConfig(),
    connections = [],
    Id=1;
enemyServer.send({type: 'send', call: 'config', data: config}); // Send config Data to Enemy Server

var squares = [],
    triangles = [],
    pentagons = [];
enemyServer.on('message', m => {
    if(m.type === 'send') {
        if(m.call === 'sendSquares') squares = m.data;
        if(m.call === 'sendTriangles') triangles = m.data;
        if(m.call === 'sendPentagons') pentagons = m.data;
        updateEnemies();
    }
});

var updateMessages = () => io.sockets.emit('get messages', core.chatServer.getMessages()),
  	updateUsernames = () => {
    		io.sockets.emit('get players', core.playerServer.getPlayers());
    		io.sockets.emit('get id', Id);
  	},
  	updateWorld = () => io.sockets.emit('update world', {w: config.w, h: config.h}),
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
    socket.user = new entities.player(Id, socket.request.client._peername.address, socket.id);
    core.playerServer.addPlayer(socket.user);
    updateUsernames();
    updateWorld();
    Id++;

    socket.on('disconnect', data => {
        if(socket.user !== undefined){
            core.playerServer.getPlayers().splice(core.playerServer.getPlayers().indexOf(socket.user), 1);
            updateUsernames();
        }
        connections.splice(connections.indexOf(socket), 1);
    });

    socket.on('join game', (data, callback) => {
        if(socket.user.playing) return;
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.user)].nick = data;
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.user)].x = ~~(Math.random() * (config.w - 199) + 100);
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.user)].y = ~~(Math.random() * (config.h - 199) + 100);
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.user)].playing = true;
        updateUsernames();
        updateMessages();
    });

    socket.on('user update', (r, km) => {
        if(!socket.user.playing) return;
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.user)].r = r;
        core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.user)].keyMap = km;
    });

    socket.on('start chatting', () => {
        if(socket.user.playing) core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.user)].chatting = true;
    });

    socket.on('stop chatting', () => {
        if(socket.user.playing) core.playerServer.getPlayers()[core.playerServer.getPlayers().indexOf(socket.user)].chatting = false;
    });

    socket.on('send message', data => {
        if(!socket.user.playing) return;
        for(var i=0; i<core.muteServer.getMuteList().length; i++) if(socket.user.id === core.muteServer.getMuteList()[i]) return entities.chat(socket.user.id, '[Server]', 'You are muted and cannot chat!');
        entities.chat('all', socket.user.nick, data)
    });

    socket.on('new bullet', (xd, yd) => {
        if(socket.user.playing) return socket.user.shoot(xd, yd);
    });
});

const updates = setInterval(() => {
    if (core.playerServer.getPlayers().length == 0) return;
    core.pluginService.getPlugins().forEach(plugin => {
        if(plugin.run) plugin.run();
    });
    core.playerServer.getPlayers().forEach(player => player.update());
    core.bulletServer.getBullets().forEach(bullet => bullet.update());
    core.physics.collisions();
    updatePositions();
    updateBullets();
}, 1000/config.fps);
console.log("[\x1b[34mINFO\x1b[0m] Loading server...");
server.listen(process.env.PORT || config.port, process.env.IP || "0.0.0.0", () => {
    process.title = "diepio private server";
    console.log(`[\x1b[36mConsole\x1b[0m] Server running node ${process.version} On port ${server.address().port}`);
    var cmds = new (require('asyncconsole'))(' > ', data => {
        var msg = data.trim().toString().split(" ");
        for (var i in commandList) if(i === msg[0]) commandList[i](msg)
    });
});

exports.ban = ban;
exports.updateMessages = updateMessages;
exports.Id = () => Id;
exports.setId = id => Id = id;
exports.enemyServer = enemyServer;
exports.getConfig = () => config;
exports.getSquares = () => squares;
exports.getTriangles = () => triangles;
exports.getPentagons = () => pentagons;
