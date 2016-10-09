var sketchProc = function(processingInstance) {
    with(processingInstance) {
        size(window.innerWidth, window.innerHeight-3.25);
        frameRate(60); //Set The Frame Rate
        textAlign(CENTER, CENTER);
        var l = function() {
            return this.Function("gflink", "var f=document.createElement('link');f.setAttribute('rel','stylesheet');f.setAttribute('type','text/css');f.setAttribute('href',gflink);document.head.appendChild(f);");
        }();
        l("./css/ubuntu.css");
        textFont(createFont("Ubuntu"));
        textSize(20);

        var socket = io.connect();
        var username =  [];
        var gameArea =  document.getElementById("gameArea");
        var chatForm =  document.getElementById("chatForm");
        var message =  document.getElementById("message");
        var messages =  document.getElementById("messages");
        var chat = document.getElementById("chat");
        var users = [];
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

        /** Enemies **/
        var squares = [];
        var triangles = [];
        var pentagons = [];

        var Square = function(x, y, r) {
            this.pos = new PVector(x, y); //Its Position
            this.r = r; //Its Starting Rotation
            this.d = 35; //Its Diameter
        };
        Square.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            rotate(this.r);
            stroke(85);
            strokeWeight(3);
            fill(colors.square);
            rect(-this.d / 2, -this.d / 2, this.d, this.d);
            popMatrix();
        };

        var Triangle = function(x, y, r) {
            this.pos = new PVector(x, y); //Its Position
            this.r = r; //Its Starting Rotation
            this.d = 20; //Its Diameter
        };
        Triangle.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            rotate(this.r);
            stroke(85);
            strokeWeight(3);
            fill(colors.triangle);
            triangle(0, 0 - this.d / 1.25, 0 - this.d, 0 + this.d, 0 + this.d, 0 + this.d);
            popMatrix();
        };

        var Pentagon = function(x, y, r) {
            this.pos = new PVector(x, y); //Its Position
            this.r = r; //Its Starting Rotation
            this.d = 60; //Its Diameter
        };
        Pentagon.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            rotate(this.r);
            stroke(85);
            strokeWeight(3);
            fill(colors.pentagon);
            beginShape();
            vertex(0, 0 - this.d / 2);
            vertex(0 + this.d / 2, 0 - this.d / 8);
            vertex(0 + this.d / 3, 0 + this.d / 2);
            vertex(0 - this.d / 3, 0 + this.d / 2);
            vertex(0 - this.d / 2, 0 - this.d / 8);
            vertex(0, 0 - this.d / 2);
            endShape();
            popMatrix();
        };

        if(chatForm.addEventListener){
            chatForm.addEventListener("submit", function(e){
                e.preventDefault();
                socket.emit('send message', message.value);
                message.value = '';
            }, false);  //Modern browsers
        }else if(chatForm.attachEvent){
            chatFormele.attachEvent('onsubmit', function(e){
                e.preventDefault();
                socket.emit('send message', message.value);
                message.value = '';
            });            //Old IE
        }

        socket.on('get users', function(data){
            var stuffs=[];
            for(var i=0; i<data.length; i++){
                stuffs.push({x: data[i].x, y: data[i].y, name: data[i].name, id: data[i].id});
            }
            users=stuffs;
            var num=0;
            for(var i=0; i<users.length; i++){
                if(users[i].id===myId){
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
            var html = '';
            for(var i=0; i<data.length; i++){
                if(data[i].to==='all'||data[i].to===myId){
                    html += '<div class="well"><strong>'+data[i].user+':</strong> '+data[i].msg+'</div>';
                }
            }
            messages.innerHTML = html;
            messages.scrollTop = messages.scrollHeight;
        });

        socket.on('update world', function(data){
            world.w = data.w;
            world.h = data.h;
        });
        socket.on('update enemies', function(s, t, p){
            var stuff=[];
            for(var i=0; i<s.length; i++){
                stuff.push(new Square(s[i].x, s[i].y, s[i].r));
            }
            squares=stuff;
            var stuff=[];
            for(var i=0; i<t.length; i++){
                stuff.push(new Triangle(t[i].x, t[i].y, t[i].r));
            }
            triangles=stuff;
            var stuff=[];
            for(var i=0; i<p.length; i++){
                stuff.push(new Pentagon(p[i].x, p[i].y, p[i].r));
            }
            pentagons=stuff;
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
        var mapCamera = {
            x: 0,
            y: 0,
            right: -world.w,
            bottom: -world.h,
            run: function() {
                for(var i=0; i<users.length; i++){
                    if(users[i].id===myId){
                        this.x = users[i].x;
                        this.y = users[i].y;
                        this.right = -world.w;
                        this.bottom = -world.h;
                        this.x = constrain(this.x + (width / 2 - users[i].x - this.x), this.right, this.left);
                        this.y = constrain(this.y + (height / 2 - users[i].y - this.y), this.bottom, this.top);
                        translate(this.x, this.y);
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
                    this.ax = 115 * users[myNum].x / world.w;
                    this.ay = 115 * users[myNum].y / world.h;
                }
                stroke(100);
                strokeWeight(5);
                fill(207, 207, 207, 200);
                rect(this.x, this.y, 125, 125);
                strokeWeight(5);
                stroke(114);
                pushMatrix();
                translate(this.ax + (width - 130), this.ay + (height - 130));
                rotate(atan2(mouseY - height / 2, mouseX - width / 2));
                fill(0);
                triangle(10, 0, -1, -2.5, -1, 2.5);
                popMatrix();
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
                    squares[i].display();
                }
                for(var i=0; i<triangles.length; i++){
                    triangles[i].display();
                }
                for(var i=0; i<pentagons.length; i++){
                    pentagons[i].display();
                }
                textSize(20);
                for(var i=0; i<users.length; i++){
                    if(users[i].id===myId){
                        fill(colors.tank_blue);
                    } else {
                        fill(colors.tank_red);
                    }
                    ellipse(users[i].x, users[i].y, 35, 35);
                    fill(255, 255, 255);
                    text(users[i].name, users[i].x, users[i].y);
                }
                popMatrix();
                minimap.run();
                if(keys[UP]){
                    socket.emit('move up', 2.5);
                }
                if(keys[DOWN]){
                    socket.emit('move down', 2.5);
                }
                if(keys[LEFT]){
                    socket.emit('move left', 2.5);
                }
                if(keys[RIGHT]){
                    socket.emit('move right', 5);
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
                    chat.style.visibility = 'visible';
                }
            }
        };
        var keyTyped = function() {
          if (!playing) {
              if (key.code !== BACKSPACE && username.length < 15 && !keys[ENTER]) {
                  username.push(key);
              }
              if (key.code === BACKSPACE) {
                  username.pop();
              }
          }
          if(playing){
              if(key.code===104 && !hideGrid){ // H key for hiding grid
                  hideGrid = true;
              } else if(key.code===104 && hideGrid){
                  hideGrid = false;
              }
          }
        };
    }
};
var canvas = document.getElementById("canvas");
var processingInstance = new Processing(canvas, sketchProc);
