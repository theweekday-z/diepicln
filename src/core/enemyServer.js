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
        square.update();
        if (square.x < 0 || square.y < 0 || square.x > config.w || square.y > config.h) squares.splice(squares.indexOf(square), 1);
    });
    process.send({type: 'send', call: 'sendSquares', data: squares});
    triangles.forEach(triangle => {
        triangle.update();
        if (triangle.x < 0 || triangle.y < 0 || triangle.x > config.w || triangle.y > config.h) triangles.splice(triangles.indexOf(triangle), 1);
    });
    process.send({type: 'send',  call: 'sendTriangles', data: triangles});
    pentagons.forEach(pentagon => {
        pentagon.update();
        if (pentagon.x < 0 || pentagon.y < 0 || pentagon.x > config.w || pentagon.y > config.h) pentagons.splice(pentagons.indexOf(pentagon), 1);
    });
    process.send({type: 'send',  call: 'sendPentagons', data: pentagons });
};
