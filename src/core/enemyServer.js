class square {
    constructor(x, y, r, d, vel) {
        this.x = x || ~~(Math.random() * (config.w-100 - 100 + 1) + 100);
        this.y = y || ~~(Math.random() * (config.h-100 - 100 + 1) + 100);
        this.r = r || ~~(Math.random() * (360 - 0 + 1) + 0);
        this.d = d || 35;
        this.vel = vel || [0, 0];
        this.hp = 10;
    }

    update() {
        this.r+=0.01;
        this.x += this.vel[0];
        this.y += this.vel[1];
        this.vel[0] -= this.vel[0] / 20;
        this.vel[1] -= this.vel[1] / 20;
        if (this.x < 0 || this.y < 0 || this.x > config.w || this.y > config.h) {
            squares.splice(squares.indexOf(this), 1);
        }
    }
}
class triangle {
    constructor() {
        this.x = ~~(Math.random() * (config.w-100 - 100 + 1) + 100);
        this.y = ~~(Math.random() * (config.h-100 - 100 + 1) + 100);
        this.r = ~~(Math.random() * (360 - 0 + 1) + 0);
        this.d = 20;
        this.vel = [0, 0];
        this.hp = 30;
    }

    update() {
        this.r+=0.01;
        this.x += this.vel[0];
        this.y += this.vel[1];
        this.vel[0] -= this.vel[0] / 20;
        this.vel[1] -= this.vel[1] / 20;
        if (this.x < 0 || this.y < 0 || this.x > config.w || this.y > config.h) {
            triangles.splice(triangles.indexOf(this), 1);
        }
    }
}
class pentagon {
    constructor() {
        this.x = ~~(Math.random() * (config.w-100 - 100 + 1) + 100);
        this.y = ~~(Math.random() * (config.h-100 - 100 + 1) + 100);
        this.r = ~~(Math.random() * (360 - 0 + 1) + 0);
        this.d = 60;
        this.vel = [0, 0];
        this.hp = 100;
    }

    update() {
        this.r+=0.01;
        this.x += this.vel[0];
        this.y += this.vel[1];
        this.vel[0] -= this.vel[0] / 20;
        this.vel[1] -= this.vel[1] / 20;
        if (this.x < 0 || this.y < 0 || this.x > config.w || this.y > config.h) {
            pentagons.splice(pentagons.indexOf(this), 1);
        }
    }
}

var squares = [],
    triangles = [],
    pentagons = [],
    updates,
    u;

process.on('message', m => {
    if(m.type === 'send') {
        if(m.call === 'addASquare') {
            for(var i=0; i<m.data; i++) squares.push(new square());
            process.send({type: 'send', call: 'sendSquares', data: squares});
        }
        if(m.call === 'addATriangle') {
            for(var i=0; i<m.data; i++) triangles.push(new triangle());
            process.send({type: 'send',  call: 'sendTriangles', data: triangles});
        }
        if(m.call === 'addAPentagon') {
            for(var i=0; i<m.data; i++) pentagons.push(new pentagon());
            process.send({type: 'send',  call: 'sendPentagons', data: pentagons });
        }
        if(m.call === 'config') config = m.data;
    } else if(m.type === 'request'){
        if(m.call === 'getSquares') process.send({type: 'send', call: 'sendSquares', data: squares});
        if(m.call === 'getTriangles') process.send({type: 'send',  call: 'sendTriangles', data: triangles});
        if(m.call === 'getPentagons') process.send({type: 'send',  call: 'sendPentagons', data: pentagons });
    } else if(m.type === 'remove'){
        if(m.call === 'removeASquare') {
            squares.splice(m.data, 1);
            process.send({type: 'send', call: 'sendSquares', data: squares});
        }
        if(m.call === 'removeATriangle') {
            triangles.splice(m.data, 1);
            process.send({type: 'send',  call: 'sendTriangles', data: triangles});
        }
        if(m.call === 'removeAPentagon') {
            pentagons.splice(m.data, 1);
            process.send({type: 'send',  call: 'sendPentagons', data: pentagons });
        }
    } else if(m.type === 'set') {
        if(m.call === 'setSquares') {
            for(var each in squares) {
                for(var all in m.data[each]){
                    squares[each].vel = m.data[each].vel;
                }
            }
            process.send({type: 'send', call: 'sendSquares', data: squares});
        }
        if(m.call === 'setTriangles') {
            for(var each in triangles) {
                for(var all in m.data[each]){
                    triangles[each].vel = m.data[each].vel;
                }
            }
            process.send({type: 'send', call: 'sendTriangles', data: triangles});
        }
        if(m.call === 'setPentagons') {
            for(var each in pentagons) {
                for(var all in m.data[each]){
                    pentagons[each].vel = m.data[each].vel;
                }
            }
            process.send({type: 'send', call: 'sendPentagons', data: pentagons});
        }
    }
    if(config&&!u) u = setInterval(updates, 1000/config.fps);
});

updates = () => {
    if (squares.length<config.minimumSquares) squares.push(new square());
    if (triangles.length<config.minimumTriangles) triangles.push(new triangle());
    if (pentagons.length<config.minimumPentagons) pentagons.push(new pentagon());
    squares.forEach(square => square.update());
    process.send({type: 'send', call: 'sendSquares', data: squares});
    triangles.forEach(triangle => triangle.update());
    process.send({type: 'send',  call: 'sendTriangles', data: triangles});
    pentagons.forEach(pentagon => pentagon.update());
    process.send({type: 'send',  call: 'sendPentagons', data: pentagons });
};
