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

const chatServer = require("./core/chatServer.js");
const configService = require("./core/configService.js");
const playerServer = require("./core/playerServer.js");
const bulletServer = require("./core/bulletServer.js");
const squareServer = require("./core/squareServer.js");
const triangleServer = require("./core/triangleServer.js")
const pentagonServer = require("./core/pentagonServer.js")

const bullet = require("./entities/bullet.js");
const chat = require("./entities/chat.js");
const square = require("./entities/square.js");
const triangle = require("./entities/triangle.js");
const pentagon = require("./entities/pentagon.js");
const player = require("./entities/player.js");

const commandList = require("./modules/commandList.js");

configService.init();

var config = configService.getConfig();

var players = playerServer.getPlayers();
var connections = [];
var Id=1;
var debug=true;
var chatBanList=[];
var banList=[];

var updateMessages;
var updateUsernames;
var updateWorld;
var updatePositions;
var ban;
var updateEnemies;
var updateSquares;
var updateTriangles;
var updatePentagons;
var updateBullets;
var updatingStarted = false;

var squares = [];
var triangles = [];
var pentagons = [];
var bullets = bulletServer.getBullets();

var superAwesomeUpdates = function() {
    if(players !== playerServer.getPlayers()){
        playerServer.setPlayers(players);
    }
    if(bullets !== bulletServer.getBullets()){
        bulletServer.setBullets(bullets);
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
        //socket.username = {name: data, x: Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), y: Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), xvel: 0, yvel: 0, moving: false, lvl: 1, score: 0, r: 0, d: 40, id: Id, ip: Ip};
        //players.push(socket.username);
        socket.username = new player(data, Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), 0, 0, false, 1, 0, 0, 40, Id, Ip);
        playerServer.addPlayer(socket.username);
        updateUsernames();
        updateWorld();
        updateMessages();
        Id+=1;
        ban();
    });

    //
    socket.on('user update', function(r, callback){
        players[players.indexOf(socket.username)].r=r;
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
            chat("all", socket.username.name, data)
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
        bullets.push(new bullet(x, y, xd, yd, speed, d, damage, penetration));
    });

    updateUsernames = function(){
        io.sockets.emit('get players', players);
        io.sockets.emit('get id', Id);
    };
    updatePositions = function(){
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
    };
    updateMessages = function(){
        io.sockets.emit('get messages', chatServer.getMessages());
    };
    updateWorld = function() {
        io.sockets.emit('update world', config);
    };
    ban = function(){
      for(var i=0; i<banList.length; i++){
          for(var u=0; u<players.length; u++){
              if(players[u].ip===banList[i].ip){
                  io.sockets.emit('banned', players[i].ip);
              }
          }
      }
    };
    updateEnemies = function() {
        io.sockets.emit('update enemies', squareServer.getSquares(), triangleServer.getTriangles(), pentagonServer.getPentagons());
    };
    updateSquares = function() {
        io.sockets.emit('update squares', squareServer.getSquares());
    };
    updateTriangles = function() {
        io.sockets.emit('update triangles', triangleServer.getTriangles());
    };
    updatePentagons = function() {
        io.sockets.emit('update pentagons', pentagonServer.getPentagons());
    };
    updateBullets = function() {
        io.sockets.emit('update bullets', bullets);
    };
    if(updatingStarted===false){
        // WARNING: THIS IS EXTREMELY EXPERIMENTAL
        setInterval(updateEnemies, 1000 / 60);
        //setInterval(updateSquares, 1000 / 60);
        //setInterval(updateTriangles, 1000 / 60);
        //setInterval(updatePentagons, 1000 / 60);
        setInterval(updateMessages, 1000 / 60);
        updatingStarted = true;
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
    for(var u=0; u<players.length; u++){
        /* Squares Collisions */
        for(var i=0; i<squares.length; i++){
            if (collideWith(players[u], squares[i])) {
                if(players[u].x>squares[i].x){
                    players[u].x-=1;
                    squares[i].x+=10;
                }
                if(players[u].x<squares[i].x+squares[i].d){
                    players[u].x+=1;
                    squares[i].x-=10;
                }
                if(players[u].y>squares[i].y){
                    players[u].y-=1;
                    squares[i].y+=10;
                }
                if(players[u].y<squares[i].y+squares[i].d){
                  players[u].y+=1;
                  squares[i].y-=10;
                }
            }
        }
        /* Triangles Collisions */
        for(var i=0; i<triangles.length; i++){
            if (collideWith(players[u], triangles[i])) {

            }
        }
        /* Pentagons Collisions */
        for(var i=0; i<pentagons.length; i++){
            if (collideWith(players[u], pentagons[i])) {

            }
        }
    }
};
var updates = function(){
    if(players.length!==0){
        if(squareServer.getSquares().length<config.minimumSquares){
            squareServer.addSquare(new square(Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 35));
        }
        if(triangleServer.getTriangles().length<config.minimumTriangles){
            triangleServer.addTriangle(new triangle(Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 20));
        }
        if(pentagonServer.getPentagons().length<config.minimumPentagons){
            pentagonServer.addPentagon(new pentagon(Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), Math.floor(Math.random() * (360 - 0 + 1) + 0), 60));
        }
        for(var i=0; i<squareServer.getSquares.length; i++){
            squareServer.getSquares()[i].update();
        }
        for(var i=0; i<triangleServer.getTriangles.length; i++){
            triangleServer.getTriangles()[i].update();
        }
        for(var i=0; i<pentagonServer.getPentagons.length; i++){
            pentagonServer.getPentagons()[i].update();
        }
        //collisions();
        for(var i=0; i<playerServer.getPlayers().length; i++){
            playerServer.getPlayers()[i].update();
        }
        updatePositions();
        for(var i=0; i<bullets.length; i++){
            bullets[i].update();
        }
        if(bullets.length!==0){
            updateBullets();
        }
    }
};
setInterval(updates, 0);

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
            commandList[i]();
        }
    }
    switch(msg[0]){
        case "playerlist":
            console.log("players: ");
            for(var i=0; i<players.length; i++){
                console.log("|" + "ID: " + players[i].id + " | " + "Name: " + players[i].name + " | " + "x: " + players[i].x + " | "+ "y: " + players[i].y + " | " + "IP: " + players[i].ip);
            }
            break;

        case "name":
            var nameW=[];
            for(var i=2; i<msg.length; i++){
                nameW.push(msg[i]);
            }
            for(var i=0; i<players.length; i++){
                if(players[i].id===parseInt(msg[1])){
                  players[i].name=nameW;
                  updateUsernames();
                  console.log("Changed player "+parseInt(msg[1])+"'s name to "+players[i].name);
                }
            }
            break;

        case "chat":
            var messageW=[];
            for(var i=2; i<msg.length; i++){
                messageW.push(msg[i]);
            }
            chat(msg[1], "[Server]", messageW.join(" "));
            break;

        case "chatBan":
            var cb=false;
            for(var i=0; i<players.length; i++){
                if(parseInt(msg[1])===players[i].id){ cb=true; }
            }
            for(var i=0; i<chatBanList.length; i++){
                if(parseInt(msg[1])===chatBanList[i]){ cb=false; }
            }
            if(cb){
                chatBanList.push(parseInt(msg[1]));
                chat(parseInt(msg[1]), "[Server]", "You Have Been Banned From Chatting.");
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
                    chat(parseInt(msg[1]), "[Server]", "You Have Been Unbanned From Chatting.");
                    console.log("Unbanned Player "+parseInt(msg[1])+" From Chatting.");
                }
            }
            break;

        case "ban":
            var cb=true;
            for(var i=0; i<banList.length; i++){
                if(msg[1]===banList[i].ip){ cb=false; }
            }
            if(cb){
                for(var i=0; i<players.length; i++){
                    if(players[i].ip===msg[1]){
                        banList.push({ip: players[i].ip});
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
            console.log("Banned players:");
            console.log(banList);
            break;
    }
    rl.prompt();
}).on('close', () => {
  console.log('Bye!');
  process.exit(0);
});

var m = JSON.parse(fs.readFileSync('info.json').toString());
if(!m.initiated) {
    const setupServer = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ' > '
    });
    var question = 0;
    var answers = [0];
    var questions = [
        "Do You Want To Have Automatic downloads, or just notifications of further updates? y=automatic; n=notifications"
    ];
    function displayQuestion() {
        console.log(questions[question]);
    }
    console.log("Welcome!");
    console.log("Before You Start, We Need Some Information From You.");
    displayQuestion();
    setupServer.prompt();
    setupServer.on('line', (line) => {
        var l=line.trim();
        var msg=l.split(" ");
        switch(msg[0]){
            case "y":
                answers[question]="y";
                question+=1;
                break;

            case "n":
                answers[question]="n";
                question+=1;
                break;

            default:
                console.log('"'+l+'" Is not A Valid Option, Please Try again..."');
                break;
        }
        if(question<answers.length-1){
            displayQuestion();
            //setupServer.prompt();
        }
    }).on('close', () => {
      console.log('Thank You For Your Info!');
      console.log(answers);
      process.exit(0);
    });
    m.initiated=true;
    fs.writeFile('info.json', JSON.stringify(m));
} else {
    server.listen(process.env.PORT || config.port, process.env.IP || "0.0.0.0", function(){
      var addr = server.address();
      console.log("Server running On ", addr.address + ":" + addr.port);
      rl.prompt();
    });
}
