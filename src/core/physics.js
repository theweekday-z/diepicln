const playerServer = require('./playerServer.js'),
    bulletServer = require('./bulletServer.js'),
    squareServer = require('./squareServer.js'),
    triangleServer = require('./triangleServer.js'),
    pentagonServer = require('./pentagonServer.js');
module.exports = {
    dist: function(x1, y1, x2, y2) {
        var a = x1 - x2;
        var b = y1 - y2;

        var c = Math.sqrt( a*a + b*b );

        return c;
    },
    collisions: function() {
        squareServer.getSquares().forEach(square=>{
            bulletServer.getBullets().forEach((bullet, index) => {
                if (this.dist(bullet.x, bullet.y, square.x, square.y) < square.d/2) {
                    square.vel[0] += bullet.xd * 1.5;
                    square.vel[1] += bullet.yd * 1.5;
                    bulletServer.getBullets().splice(index, 1);
                }
            });
        });
        triangleServer.getTriangles().forEach(triangle=>{
            bulletServer.getBullets().forEach((bullet, index) => {
                if (this.dist(bullet.x, bullet.y, triangle.x, triangle.y) < triangle.d/2) {
                    triangle.vel[0] += bullet.xd * 1.5;
                    triangle.vel[1] += bullet.yd * 1.5;
                    bulletServer.getBullets().splice(index, 1);
                }
            });
        });
        pentagonServer.getPentagons().forEach(pentagon=>{
            bulletServer.getBullets().forEach((bullet, index) => {
                if (this.dist(bullet.x, bullet.y, pentagon.x, pentagon.y) < pentagon.d/2) {
                    pentagon.vel[0] += bullet.xd * 1.5;
                    pentagon.vel[1] += bullet.yd * 1.5;
                    bulletServer.getBullets().splice(index, 1);
                }
            });
        });
    }
};
