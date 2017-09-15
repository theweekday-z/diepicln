var sketchProc = processingInstance => {
    with(processingInstance) {
        frameRate(0); //Set The Frame Rate
        textFont(createFont("Ubuntu"));

        var socket = io.connect(),
            username = [],
            players = [],
            message = [],
            messages = [],
            canType = true,
            myId,
            myNum,
            zoom = 0,
            gameMode = "ffa",
            hideGrid = false;

        /** Colors **/
        var colors = {
            square: color(254,231,105),
            triangle: color(252,118,119),
            pentagon: color(118,141,252),
            tank_red: color(241,78,84),
            tank_blue: color(0,178,225),
            tank_green: color(76,233,153),
            tank_purple: color(191,127,245),
            tank_barrel: color(153,153,153),
            gameBackground: color(185, 185, 185),
            gameBackgroundMain: color(205, 205, 205)
        };
        /*var colors = { //Dark
            square: color(255,232,105),
            triangle: color(252,118,119),
            pentagon: color(118,141,252),
            tank_red: color(241,78,84),
            tank_blue: color(0,178,225),
            tank_green: color(76,233,153),
            tank_purple: color(191,127,245),
            tank_barrel: color(153,153,153),
            gameBackground: color(70, 70, 70),
            gameBackgroundMain: color(50, 50, 50)
        };*/

        var textOutline = (txt, x, y, w, h, solidColor, outlineColor, o) => {
            fill(outlineColor);
            o = max(o, 1);
            for (var a = 0; a < 360; a += 360 / (2 * PI * o)) {
                if (w > 0 && h > 0) text(t, x + cos(a) * o, y + sin(a) * o, w, h);
                else text(txt, x + cos(a) * o, y + sin(a) * o);
            }
            fill(solidColor);
            if (w > 0 && h > 0) text(txt, x, y, w, h);
            else text(txt, x, y);
        };

        /** World **/
        var world = {};

        /** Stuff **/
        var squares = [];
            triangles = [];
            pentagons = [];
            bullets = [];

        socket.on('get players', data => {
            d = [];
            for(var i=0; i<data.length; i++) {
                d.push({
                    d: data[i].d,
                    id: data[i].id,
                    level: data[i].level,
                    nick: data[i].nick,
                    playing: data[i].playing,
                    r: data[i].r,
                    score: data[i].score,
                    x: data[i].x,
                    y: data[i].y});
                if(data[i].id === myId) myNum = i;
            }
            players = d;
        });
        socket.on('get id', data => {if(!myId) myId = data});
        socket.on('get messages', data => messages = data.reverse());
        socket.on('update world', data => world = data);
        socket.on('update enemies', (s, t, p) => {
            squares = s,
            triangles = t,
            pentagons = p;
        });
        socket.on('update bullets', data => bullets = data);

        var keys = {},
            keyPressed = () => keys[keyCode] = true,
            keyReleased = () => keys[keyCode] = false,
            screenx = 0;
            screeny = 0;

        var mapCamera = {
            x: 0,
            y: 0,
            right: -world.w,
            bottom: -world.h,
            run() {
                this.x = players[myNum].x;
                this.y = players[myNum].y;
                this.right = -world.w;
                this.bottom = -world.h;
                this.x = constrain(this.x + (width / 2 - players[myNum].x - this.x), this.right, this.left);
                this.y = constrain(this.y + (height / 2 - players[myNum].y - this.y), this.bottom, this.top);
                translate(this.x, this.y);
                screenx = players[myNum].x + this.x - zoom/2;
                screeny = players[myNum].y + this.y - zoom/2;
            }
        };

        var minimap = {
            x: width-135,
            y: height-135,
            ax: 0,
            ay: 0,
            run() {
                if (this.x !== width - 135 || this.y !== height - 135) {
                    this.x = width - 135;
                    this.y = height - 135;
                }
                if(myNum !== undefined) {
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
                rotate(atan2(mouseY-screeny, mouseX-screenx) - TWO_PI);
                fill(0);
                triangle(10, 0, -1, -2.5, -1, 2.5);
                popMatrix();
            }
        };

        var overlays = () => {
            if(myNum === undefined) return;
            noStroke();
            fill(22, 22, 22, 200);
            rect(width / 2 - (250 / 2), height - 60, 250, 17.5, 100);
            rect(width / 2 - (350 / 2), height - 40, 350, 20, 100);

            fill(108, 240, 162);
            rect(width / 2 - (250 / 2) + 2, height - 58, 13.5, 13.5, 100);

            fill(240, 217, 108);
            rect(width / 2 - (350 / 2) + 2, height - 38, 16, 16, 100);

            textAlign(CENTER, CENTER);
            textSize(11);
            textOutline(`Score: ${players[myNum].score}`, width / 2, height - 51, 0, 0, color(240), color(61), 1);
            textSize(12.5);
            textOutline(`Level ${players[myNum].level} Tank`, width / 2, height - 30, 0, 0, color(240), color(61), 1);
            textSize(32.5);
            textOutline(players[myNum].nick, width / 2, height - 80, 0, 0, color(240), color(61), 3.5);
        };

        var menuButton = (txt, x, y, color1, color2, color3) => {
            noStroke();
            if(gameMode === txt.toLowerCase()) fill(color3);
            else fill(color1);
            rect(x, y, 75, 15);
            fill(color2);
            rect(x, y + 15, 75, 10)
            strokeWeight(3);
            stroke(41);
            noFill();
            rect(x, y, 75, 25, 2);
            textSize(12);
            textOutline(txt, x + 38, y + 12.5, 0, 0, color(255), color(0), 1.25);
        };
        draw = () => {
            if(players.length === 0) return;
            if(players[myNum].playing) {
                size(window.innerWidth + zoom, window.innerHeight + zoom);
                background(colors.gameBackground);
                pushMatrix();
                mapCamera.run();
                fill(colors.gameBackgroundMain);
                noStroke();
                rect(width / 4, height / 4, world.w - width / 4 * 2, world.h - height / 4 * 2);
                stroke(170);
                strokeWeight(0.5);
                if(!hideGrid) {
                    for (var w = -width * 2; w < world.w + width * 2; w += 22.5) line(w, -width * 2, w, world.w * 2);
                    for (var h = -height * 2; h < world.h + height * 2; h += 22.5) line(-height * 2, h, world.h * 2, h);
                }
                strokeWeight(3);
                stroke(191,174,80);
                fill(colors.square);
                for(var i=0; i<squares.length; i++) {
                    pushMatrix();
                    translate(squares[i].x, squares[i].y);
                    rotate(squares[i].r);
                    rect(-squares[i].d / 2, -squares[i].d / 2, squares[i].d, squares[i].d);
                    popMatrix();
                }
                stroke(189,88,89);
                fill(colors.triangle);
                for(var i=0; i<triangles.length; i++) {
                    pushMatrix();
                    translate(triangles[i].x, triangles[i].y);
                    rotate(triangles[i].r);
                    triangle(0, 0 - triangles[i].d / 1.25, 0 - triangles[i].d, 0 + triangles[i].d, 0 + triangles[i].d, 0 + triangles[i].d);
                    popMatrix();
                }
                stroke(88,105,189);
                fill(colors.pentagon);
                for(var i=0; i<pentagons.length; i++) {
                    pushMatrix();
                    translate(pentagons[i].x, pentagons[i].y);
                    rotate(pentagons[i].r);
                    beginShape();
                    vertex(0, 0 - pentagons[i].d / 2);
                    vertex(0 + pentagons[i].d / 2, 0 - pentagons[i].d / 8);
                    vertex(0 + pentagons[i].d / 3, 0 + pentagons[i].d / 2);
                    vertex(0 - pentagons[i].d / 3, 0 + pentagons[i].d / 2);
                    vertex(0 - pentagons[i].d / 2, 0 - pentagons[i].d / 8);
                    endShape(CLOSE);
                    popMatrix();
                }
                strokeWeight(2.5);
                for(var i=0; i<bullets.length; i++) {
                    if(bullets[i].owner === myId) {
                        fill(colors.tank_blue, 255-bullets[i].transparency * 255);
                        stroke(0,133,168, 255-bullets[i].transparency * 255);
                    } else {
                        fill(colors.tank_red, 255-bullets[i].transparency * 255);
                        stroke(180, 58, 63, 255-bullets[i].transparency * 255);
                    }
                    ellipse(bullets[i].x, bullets[i].y, bullets[i].d, bullets[i].d);
                }
                textSize(20);
                for(var i=0; i<players.length; i++) {
                    if(!players[i].playing) break;
                    pushMatrix();
                    translate(players[i].x, players[i].y);
                    rotate(players[i].r);
                    stroke(114);
                    fill(colors.tank_barrel);
                    rect(-8.75, 5, 17.5, 35);
                    popMatrix();
                    if(players[i].id === myId) {
                        fill(colors.tank_blue);
                        stroke(0, 133, 168);
                    } else {
                        fill(colors.tank_red);
                        stroke(180, 58, 63)
                    }
                    ellipse(players[i].x, players[i].y, players[i].d, players[i].d);
                    if(players[i].id === myNum) return;
                    fill(255);
                    text(players[i].nick, players[i].x, players[i].y);
                }
                popMatrix();
                minimap.run();
                overlays();
                if(canType) fill(0,0,0,150);
                else fill(0,0,0,50);
                noStroke();
                rect(25, height-65, 250, 40);
                textAlign(LEFT, TOP);
                textSize(20);
                fill(245);
                text(message.join(""), 30, height-55);
                fill(0);
                textSize(25);
                for(var i=0; i<(messages.length <= 10 ? messages.length : 10); i++) text(`${messages[i].user}: ${messages[i].msg}`, 50, height - 120 - i * 25);
                var plyrs = [];
                for(var i=0; i<players.length; i++) if(players[i].playing) plyrs.push(players[i]);
                plyrs.sort((a, b) => b.score-a.score);
                textAlign(CENTER, CENTER);
                for(var i=0; i<(plyrs.length <= 10 ? plyrs.length : 10); i++){
                    fill(22, 22, 22, 200);
                    rect(width - 190, 25 + i * 20, 175, 16, 100);
                    fill(108, 240, 162);
                    rect(width - 189, 26 + i * 20, 13 + (plyrs[i].score%plyrs[0].score || 100)/100*160, 14, 100);
                    textSize(12.5);
                    textOutline(`${plyrs[i].nick} - ${plyrs[i].score}`, width - 102.5, 33 + i * 20, 0, 0, color(255, 255, 255), color(0, 0, 0), 1.75);
                }
                socket.emit('user update', atan2(mouseY-screeny, mouseX-screenx) - HALF_PI, keys);
            } else {
                size(window.innerWidth, window.innerHeight);
                background(124);
                textSize(16);
                textOutline("Game mode", width / 2, 18, 0, 0, color(255), color(0), 1.75);
                //
                menuButton("FFA", width/2-160, 35, color(142,255,251), color(114,205,202), color(91,164,161));
                menuButton("2 Teams", width/2-80, 35, color(195,255,164), color(145,205,114), color(116,164,91));
                menuButton("4 Teams", width/2, 35, color(255,142,142), color(205,114,114), color(164,91,91));
                menuButton("Domination", width/2+80, 35, color(255,235,142), color(205,189,114), color(163,150,91));
                menuButton("Tag", width/2-120, 65, color(142,178,255), color(114,143,205), color(91,114,164));
                menuButton("Maze", width/2-40, 65, color(155,122,219), color(146,114,205), color(116,91,164));
                menuButton("Sandbox", width/2+40, 65, color(251,142,255), color(202,114,205), color(161,91,164));
                //
                textSize(19);
                textOutline("This is the tale of...", width / 2, height / 2 - 35, 0, 0, color(255), color(0), 1.85);
                fill(238);
                stroke(0);
                strokeWeight(4);
                rect(width / 2 - (325 / 2)+2, height / 2 - (40 / 2), 325-4, 40);
                textAlign(LEFT, CENTER);
                textSize(30);
                if (round(frameCount / 100) % 2 === 0) textOutline(username.join("") + "|", width / 2 - (320 / 2), height / 2, 0, 0, color(0));
                else textOutline(username.join(""), width / 2 - (320 / 2), height / 2, 0, 0, color(0));
                textAlign(CENTER, CENTER);
                textSize(11);
                textOutline("(press enter to spawn)", width / 2, height / 2 + 30, 0, 0, color(255), color(0), 1.25);
                if (keys[ENTER]) socket.emit('join game', username.join(""), data => {if(data) canType = false});
            }
            textAlign(LEFT, TOP);
            textSize(17.5);
            fill(0, 75, 0);
            text(`Framerate: ${round(__frameRate)}`, 10, 10);
            textAlign(CENTER, CENTER);
        };

        onkeydown = e => {
            if (e.keyCode == 8) {
                if(!players[myNum].playing) username.pop();
                else if(canType) message.pop();
            }
        }

        keyTyped = () => {
            if (!players[myNum].playing) if (key.code !== 8 && username.length < 15 && !keys[ENTER]) return username.push(key);
            if(canType){
                if(keys[ENTER]) {
                    if(message.length !== 0){
                        socket.emit('send message', message.join(""));
                        message = [];
                    }
                    socket.emit('stop chatting');
                    canType = false;
                }
                if (key.code !== 8 && message.length < 500 && !keys[ENTER]) message.push(key);
            } else {
                if(keys[ENTER]){
                    socket.emit('start chatting');
                    canType = true;
                }
                if(key.code === 104) hideGrid ? hideGrid = false : hideGrid = true;
            }
        };
        mouseClicked = () => {
            if(!players[myNum].playing) return;
            var r = atan2(mouseY-screeny, mouseX-screenx);
            socket.emit('new bullet', cos(r), sin(r));
        };
    }
};
var canvas = document.getElementById("canvas");
var processingInstance = new Processing(canvas, sketchProc);
