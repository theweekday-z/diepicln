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

const bullet = require("./entities/bullet.js");

configService.init();

var config = configService.getConfig();

var players = playerServer.getPlayers();
var connections = [];
var messages = chatServer.getMessages();
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
    if(messages !== chatServer.getMessages()){
        chatServer.setMessages(messages);
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
        if(debug){ console.log('Connected: %s players connected', connections.length); }
    });

    //New User
    socket.on('new user', function(data, Ip, callback){
        callback(true);
        socket.username = {name: data, x: Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), y: Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), xvel: 0, yvel: 0, moving: false, lvl: 1, score: 0, r: 0, d: 40, id: Id, ip: Ip};
        players.push(socket.username);
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
            var message = {msg: data, user: socket.username.name, to: "all"};
            messages.push(message);
            updateMessages();
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
        io.sockets.emit('get messages', messages);
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
        io.sockets.emit('update enemies', squares, triangles, pentagons);
    };
    updateBullets = function() {
        io.sockets.emit('update bullets', bullets);
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
        if(squares.length<config.minimumSquares){
            squares.push({x: Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), y: Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), r: Math.floor(Math.random() * (360 - 0 + 1) + 0), d: 35})
        }
        if(triangles.length<config.minimumTriangles){
            triangles.push({x: Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), y: Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), r: Math.floor(Math.random() * (360 - 0 + 1) + 0), d: 20})
        }
        if(pentagons.length<config.minimumPentagons){
            pentagons.push({x: Math.floor(Math.random() * (config.w-100 - 100 + 1) + 100), y: Math.floor(Math.random() * (config.h-100 - 100 + 1) + 100), r: Math.floor(Math.random() * (360 - 0 + 1) + 0), d: 60})
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
        for(var i=0; i<players.length; i++){
            players[i].x+=players[i].xvel;
            players[i].y+=players[i].yvel;
            if(!players[i].moving){
                players[i].xvel/=1.05;
                players[i].yvel/=1.05;
            } else {
                if(players[i].xvel > 1){
                    players[i].xvel = 1;
                }
                if(players[i].yvel > 1){
                    players[i].yvel = 1;
                }
                if(players[i].xvel < -1){
                    players[i].xvel = -1;
                }
                if(players[i].yvel < -1){
                    players[i].yvel = -1;
                }
            }
        }
        updatePositions();
        for(var i=0; i<bullets.length; i++){
            bullets[i].stats.x += bullets[i].stats.xd;
            bullets[i].stats.y += bullets[i].stats.yd;
            if(!bullets[i].initiated){
                console.log(bullets[i].getStats());
            }
        }
        if(bullets.length!==0){
            updateBullets();
        }
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
            chat(msg[1], messageW.join(" "));
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
