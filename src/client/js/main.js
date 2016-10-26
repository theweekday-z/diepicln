var sketchProc = function(processingInstance) {
    with(processingInstance) {
        size(window.innerWidth, window.innerHeight-3.25);
        frameRate(60); //Set The Frame Rate
        var l = function() {
            return this.Function("gflink", "var f=document.createElement('link');f.setAttribute('rel','stylesheet');f.setAttribute('type','text/css');f.setAttribute('href',gflink);document.head.appendChild(f);");
        }();
        l("./css/ubuntu.css");
        textFont(createFont("Ubuntu"));
        textSize(20);

        var socket = io.connect();
        var username =  [];
        var players = [];
        var message = [];
        var messages = [];
        var canType = true;
        var myId=0;
        var myIdAssigned=false;
        var myNum=0;
        var myNumAssigned=false;

        var playing = false;
        var hideGrid = false;

        /** Colors **/
        var colors = {
            square: color(255,232,105),
            triangle: color(252,118,119),
            pentagon: color(118,141,252),
            tank_red: color(241,78,84),
            tank_blue: color(0,178,225),
            tank_green: color(76,233,153),
            tank_purple: color(191,127,245),
            tank_barrel: color(153,153,153)
        };

        var textOutline = function(t, x, y, w, h, fc, sc, o) {
            fill(sc);
            o = max(o, 1);
            for (var a = 0; a < 360; a += 360 / (2 * PI * o)) {
                if (w > 0 && h > 0) {
                    text(t, x + cos(a) * o, y + sin(a) * o, w, h);
                } else {
                    text(t, x + cos(a) * o, y + sin(a) * o);
                }
            }
            fill(fc);
            if (w > 0 && h > 0) {
                text(t, x, y, w, h);
            } else {
                text(t, x, y);
            }
        };

        /** World **/
        var world = {
            w: 0, //World Width
            h: 0 //World Height
        };

        /** Stuff **/
        var squares = [];
        var triangles = [];
        var pentagons = [];
        var bullets = [];

        socket.on('get players', function(data){
            var stuffs=[];
            for(var i=0; i<data.length; i++){
                stuffs.push({x: data[i].x, y: data[i].y, name: data[i].name, score: data[i].score, lvl: data[i].lvl, r: data[i].r, d: data[i].d, id: data[i].id});
            }
            players=stuffs;
            var num=0;
            for(var i=0; i<players.length; i++){
                if(players[i].id===myId){
                  myNum = num;
                }
                num+=1;
            }
            myNumAssigned=true;
        });
        socket.on('get id', function(data){
            if(!myIdAssigned){
                myId=data;
                myIdAssigned=true;
            }
        });
        socket.on('get messages', function(data){
            var nmsgs=[];
            for(var i=0; i<data.length; i++){
                nmsgs.push({user: data[i].user, msg: data[i].msg});
            }
            messages = nmsgs;
        });

        socket.on('update world', function(data){
            world.w = data.w;
            world.h = data.h;
        });
        socket.on('update enemies', function(s, t, p){
            var stuff=[];
            for(var i=0; i<s.length; i++){
                stuff.push({x: s[i].x, y: s[i].y, r: s[i].r, d: s[i].d});
            }
            squares=stuff;
            var stuff=[];
            for(var i=0; i<t.length; i++){
                stuff.push({x: t[i].x, y: t[i].y, r: t[i].r, d: t[i].d});
            }
            triangles=stuff;
            var stuff=[];
            for(var i=0; i<p.length; i++){
                stuff.push({x: p[i].x, y: p[i].y, r: p[i].r, d: p[i].d});
            }
            pentagons=stuff;
        });

        socket.on('update bullets', function(data){
            var stuff=[];
            for(var i=0; i<data.length; i++){
                stuff.push({x: data[i].x, y: data[i].y, d: data[i].d});
            }
            bullets=stuff;
        });

        socket.on('banned', function(data){
            if(data===myIp){
                window.location="./banned.html";
            }
        });

        var keys = {};
        var keyPressed = function() {
            keys[keyCode] = true;
        };
        var keyReleased = function() {
            keys[keyCode] = false;
        };
        var screenx = 0;
        var screeny = 0;

        var mapCamera = {
            x: 0,
            y: 0,
            right: -world.w,
            bottom: -world.h,
            run: function() {
                for(var i=0; i<players.length; i++){
                    if(players[i].id===myId){
                        this.x = players[i].x;
                        this.y = players[i].y;
                        this.right = -world.w;
                        this.bottom = -world.h;
                        this.x = constrain(this.x + (width / 2 - players[i].x - this.x), this.right, this.left);
                        this.y = constrain(this.y + (height / 2 - players[i].y - this.y), this.bottom, this.top);
                        translate(this.x, this.y);
                        screenx = players[i].x + this.x;
                        screeny = players[i].y + this.y;
                    }
                }
            }
        };

        var minimap =  {
            x: width-135,
            y: height-135,
            ax: 0,
            ay: 0,
            run: function() {
                if (this.x !== width - 135 || this.y !== height - 135) {
                    this.x = width - 135;
                    this.y = height - 135;
                }
                if(myNumAssigned){
                    this.ax = 115 * players[myNum].x / world.w;
                    this.ay = 115 * players[myNum].y / world.h;
                }
                stroke(100);
                strokeWeight(5);
                fill(207, 207, 207, 200);
                rect(this.x, this.y, 125, 125);
                strokeWeight(5);
                stroke(114);
                pushMatrix();
                translate(this.ax + (width - 130), this.ay + (height - 130));
                rotate(players[myNum].r);
                fill(0);
                triangle(10, 0, -1, -2.5, -1, 2.5);
                popMatrix();
            }
        };

        var overlays = function() {
            if(myNumAssigned){
                noStroke();
                fill(22, 22, 22, 200);
                rect(width / 2 - (250 / 2), height - 60, 250, 17.5, 100);
                rect(width / 2 - (350 / 2), height - 40, 350, 20, 100);

                fill(108, 240, 162);
                rect(width / 2 - (250 / 2) + 2, height - 58, 13.5/*+this.scoreBarLength*/, 13.5, 100);

                fill(240, 217, 108);
                rect(width / 2 - (350 / 2) + 2, height - 38, 16/*+this.levelBarLength*/, 16, 100);

                textAlign(CENTER, CENTER);
                textSize(11);
                textOutline("Score: " + players[myNum].score, width / 2, height - 51, 0, 0, color(240), color(61), 1);
                textSize(12.5);
                textOutline("Lvl " + players[myNum].lvl + " Tank", width / 2, height - 30, 0, 0, color(240), color(61), 1);
                textSize(32.5);
                textOutline(players[myNum].name, width / 2, height - 80, 0, 0, color(240), color(61), 3.5);
            }



            /* Leaderboard */
            for (var i = 0; i < 10; i += 1) {

            }
        };

        var draw = function() {
            size(window.innerWidth, window.innerHeight-3.25);
            if(playing){
                background(185);
                pushMatrix();
                mapCamera.run();
                fill(205);
                noStroke();
                rect(0,0,world.w,world.h);
                if(!hideGrid){
                    stroke(170);
                    strokeWeight(1);
                    for (var w = 0-width; w < world.w+width; w += 22.5) {
                        line(w, 0, w, world.w);
                    }
                    for (var h = 0-height; h < world.h+height; h += 22.5) {
                        line(0, h, world.h, h);
                    }
                }
                for(var i=0; i<squares.length; i++){
                    pushMatrix();
                    translate(squares[i].x, squares[i].y);
                    rotate(squares[i].r);
                    stroke(85);
                    strokeWeight(3);
                    fill(colors.square);
                    rect(-squares[i].d / 2, -squares[i].d / 2, squares[i].d, squares[i].d);
                    popMatrix();
                }
                for(var i=0; i<triangles.length; i++){
                    pushMatrix();
                    translate(triangles[i].x, triangles[i].y);
                    rotate(triangles[i].r);
                    stroke(85);
                    strokeWeight(3);
                    fill(colors.triangle);
                    triangle(0, 0 - triangles[i].d / 1.25, 0 - triangles[i].d, 0 + triangles[i].d, 0 + triangles[i].d, 0 + triangles[i].d);
                    popMatrix();
                }
                for(var i=0; i<pentagons.length; i++){
                    pushMatrix();
                    translate(pentagons[i].x, pentagons[i].y);
                    rotate(pentagons[i].r);
                    stroke(85);
                    strokeWeight(3);
                    fill(colors.pentagon);
                    beginShape();
                    vertex(0, 0 - this.d / 2);
                    vertex(0 + pentagons[i].d / 2, 0 - pentagons[i].d / 8);
                    vertex(0 + pentagons[i].d / 3, 0 + pentagons[i].d / 2);
                    vertex(0 - pentagons[i].d / 3, 0 + pentagons[i].d / 2);
                    vertex(0 - pentagons[i].d / 2, 0 - pentagons[i].d / 8);
                    vertex(0, 0 - pentagons[i].d / 2);
                    vertex(0, 0 - this.d / 2);
                    endShape();
                    popMatrix();
                }
                for(var i=0; i<bullets.length; i++){
                    stroke(85);
                    strokeWeight(2.5);
                    fill(241, 78, 84);
                    ellipse(bullets[i].x, bullets[i].y, bullets[i].d, bullets[i].d);
                }
                textSize(20);
                for(var i=0; i<players.length; i++){
                    stroke(62);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(players[i].x, players[i].y);
                    rotate(players[i].r);
                    fill(colors.tank_barrel);
                    rect(-8.75, 5, 17.5, 35);
                    popMatrix();
                    if(players[i].id===myId){
                        fill(colors.tank_blue);
                    } else {
                        fill(colors.tank_red);
                    }
                    ellipse(players[i].x, players[i].y, players[i].d, players[i].d);
                    if(players[i].id!==myId){
                      fill(255, 255, 255);
                      text(players[i].name, players[i].x, players[i].y);
                    }
                }
                popMatrix();
                minimap.run();
                overlays();
                if(canType){
                    fill(0,0,0,150);
                } else {
                    fill(0,0,0,50);
                }
                noStroke();
                rect(25,height-65,250,40);
                textAlign(LEFT,TOP);
                textSize(25);
                fill(200);
                text(message.join(""), 30,height-60);
                fill(0);
                textSize(25);
                for(var i=0; i<messages.length; i++){
                    text(messages[i].user+": "+messages[i].msg, 50,50+i*25);
                }
                if(!canType){
                    if (keys[UP] || keys[87]) {
                        socket.emit('move up');
                    }
                    if (keys[DOWN] || keys[83]) {
                        socket.emit('move down');
                    }
                    if (keys[RIGHT] || keys[68]) {
                        socket.emit('move right');
                    }
                    if (keys[LEFT] || keys[65]) {
                        socket.emit('move left');
                    }
                    if(!keys[LEFT]&&!keys[DOWN]&&!keys[RIGHT]&&!keys[LEFT]&&!keys[87]&&!keys[83]&&!keys[68]&&!keys[65]){
                        socket.emit('stop moving');
                    }
                    socket.emit('user update', atan2(mouseY-screeny, mouseX-screenx) - HALF_PI);
                }
            } else {
                background(124,124,124);
                textSize(16);
                textOutline("Game mode", width / 2, 20, 0, 0, color(255), color(0), 2);
                textSize(20);
                textOutline("This is the tale of...", width / 2, height / 2 - 35, 0, 0, color(255), color(0), 2);
                fill(238);
                stroke(0);
                strokeWeight(4);
                rect(width / 2 - (325 / 2), height / 2 - (40 / 2), 325, 40);
                textAlign(LEFT, CENTER);
                textSize(30);
                if (round(frameCount / 40) % 2 === 0) {
                    textOutline(username.join("") + "|", width / 2 - (320 / 2), height / 2, 0, 0, color(0));
                } else {
                    textOutline(username.join(""), width / 2 - (320 / 2), height / 2, 0, 0, color(0));
                }
                textAlign(CENTER, CENTER);
                textSize(11);
                textOutline("(press enter to spawn)", width / 2, height / 2 + 30, 0, 0, color(255), color(0), 1.25);
                if (keys[ENTER]) {
                    socket.emit('new user', username.join(""), myIp, function(data){
                        if(data){
                            //do this next
                        }
                    });
                    playing = true;
                    canType=false;
                }
            }
            textSize(20);
            fill(0,0,0);
            text(__frameRate, 500, 100);
        };
        function preventBackspaceHandler(evt) {
            evt = evt || window.event;
            if (evt.keyCode == 8) {
                if(!playing){
                  username.pop();
                } else {
                    if(canType){
                        message.pop();
                    }
                }
                return false;
            }
        }

        document.onkeydown = preventBackspaceHandler;
        var keyTyped = function() {
            if (!playing) {
                if (key.code !== 8 && username.length < 15 && !keys[ENTER]) {
                    username.push(key);
                }
            }
            if(playing){
                if(canType){
                    if (key.code !== 8 && message.length < 500 && !keys[ENTER]) {
                        message.push(key);
                    }
                } else {
                    if(key.code===104 && !hideGrid){ // H key for hiding grid
                        hideGrid = true;
                    } else if(key.code===104 && hideGrid){
                        hideGrid = false;
                    }
                }
                if(keys[ENTER] && !canType){
                    canType = true;
                } else if(keys[ENTER] && canType){
                    if(message.length!==0){
                        socket.emit('send message', message.join(""));
                        message = [];
                    }
                    canType = false;
                }
            }
        };
        mouseClicked = function() {
          for(var i=0; i<players.length; i++){
              if(players[i].id===myId){
                  var r = atan2(mouseY - height / 2, mouseX - width / 2);
                  socket.emit('new bullet', players[i].x, players[i].y, cos(r), sin(r), 5, 19, 1, 1);
              }
          }
        };
    }
};
var canvas = document.getElementById("canvas");
var processingInstance = new Processing(canvas, sketchProc);
