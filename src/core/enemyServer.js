const square = require('../entities/square.js'),
    triangle = require('../entities/triangle.js'),
    pentagon = require('../entities/pentagon.js');

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
            for(var each in squares) for(var all in m.data[each]) squares[each].vel = m.data[each].vel;
            process.send({type: 'send', call: 'sendSquares', data: squares});
        }
        if(m.call === 'setTriangles') {
            for(var each in triangles) for(var all in m.data[each]) triangles[each].vel = m.data[each].vel;
            process.send({type: 'send', call: 'sendTriangles', data: triangles});
        }
        if(m.call === 'setPentagons') {
            for(var each in pentagons) for(var all in m.data[each]) pentagons[each].vel = m.data[each].vel;
            process.send({type: 'send', call: 'sendPentagons', data: pentagons});
        }
    }
    if(config&&!u) u = setInterval(updates, 1000/config.fps);
});

updates = () => {
    if (squares.length<config.minimumSquares) squares.push(new square());
    if (triangles.length<config.minimumTriangles) triangles.push(new triangle());
    if (pentagons.length<config.minimumPentagons) pentagons.push(new pentagon());
    squares.forEach(square => {
        if (square.x < 0) {
            square.xdir = Math.random() * 0.25;
            square.vel[0] += 2;
            square.x = 0;
        }
        if (square.y < 0) {
            square.ydir = Math.random() * 0.125;
            square.vel[1] += 2;
            square.y = 0;
        }
        if (square.x > config.w) {
            square.xdir = Math.random() * (0 - -0.125) - 0.125;
            square.vel[0] -= 2;
            square.x = config.w;
        }
        if (square.y > config.h) {
            square.ydir = Math.random() * (0 - -0.125) - 0.125;
            square.vel[1] -= 2;
            square.y = config.h;
        }
        square.update();
        //squares.splice(squares.indexOf(square), 1);
    });
    process.send({type: 'send', call: 'sendSquares', data: squares});
    triangles.forEach(triangle => {
        if (triangle.x < 0) {
            triangle.xdir = Math.random() * 0.125;
            triangle.vel[0] += 2;
            triangle.x = 0;
        }
        if (triangle.y < 0) {
            triangle.ydir = Math.random() * 0.125;
            triangle.vel[1] += 2;
            triangle.y = 0;
        }
        if (triangle.x > config.w) {
            triangle.xdir = Math.random() * (0 - -0.125) - 0.125;
            triangle.vel[0] -= 2;
            triangle.x = config.w;
        }
        if (triangle.y > config.h) {
            triangle.ydir = Math.random() * (0 - -0.125) - 0.125;
            triangle.vel[1] -= 2;
            triangle.y = config.h;
        }
        triangle.update();
        //triangles.splice(triangles.indexOf(triangle), 1);
    });
    process.send({type: 'send',  call: 'sendTriangles', data: triangles});
    pentagons.forEach(pentagon => {
        if (pentagon.x < 0) {
            pentagon.xdir = Math.random() * 0.125;
            pentagon.vel[0] += 2;
            pentagon.x = 0;
        }
        if (pentagon.y < 0) {
            pentagon.ydir = Math.random() * 0.125;
            pentagon.vel[1] += 2;
            pentagon.y = 0;
        }
        if (pentagon.x > config.w) {
            pentagon.xdir = Math.random() * (0 - -0.125) - 0.125;
            pentagon.vel[0] -= 2;
            pentagon.x = config.w;
        }
        if (pentagon.y > config.h) {
            pentagon.ydir = Math.random() * (0 - -0.125) - 0.125;
            pentagon.vel[1] -= 2;
            pentagon.y = config.h;
        }
        pentagon.update();
        //pentagons.splice(pentagons.indexOf(pentagon), 1);
    });
    process.send({type: 'send',  call: 'sendPentagons', data: pentagons });
};
