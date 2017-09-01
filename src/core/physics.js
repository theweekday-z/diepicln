const playerServer = require('./playerServer.js'),
    bulletServer = require('./bulletServer.js'),
    squareServer = require('./squareServer.js'),
    triangleServer = require('./triangleServer.js'),
    pentagonServer = require('./pentagonServer.js');
module.exports = {
    dist: function(x1, y1, x2, y2) {
        var a = x1 - x2;
        var b = y1 - y2;
        var c = Math.sqrt(a * a + b * b);
        return c;
    },
    collisions: function() {
        squareServer.getSquares().forEach((square, ind) => {
            /** Triangle+Bullet collisions **/
            bulletServer.getBullets().forEach((bullet, index) => {
                if (this.dist(bullet.x, bullet.y, square.x, square.y) < square.d/1.5) {
                    square.vel[0] += bullet.xd * 1.5;
                    square.vel[1] += bullet.yd * 1.5;
                    bulletServer.getBullets().splice(index, 1);
                }
            });
            /** Square+Square collisions **
            squareServer.getSquares().forEach(sqre => {
                if (this.dist(player.x, player.y, square.x, square.y) < square.d) {
                    var dst = [player.x - square.x, player.y - square.y];
                    var magnitude = this.dist(0, 0, dst[0], dst[1]);
                    dst[0] /= magnitude;
                    dst[1] /= magnitude;
                    square.vel[0] -= dst[0]/10;
                    square.vel[1] -= dst[1]/10;
                    player.vel[0] += dst[0]/10;
                    player.vel[1] += dst[1]/10;
                }
            });
            /** Square+Triangle collisions **
            triangleServer.getTriangles().forEach(triangle => {
              if (this.dist(player.x, player.y, triangle.x, triangle.y) < triangle.d) {
                  var dst = [player.x - triangle.x, player.y - triangle.y];
                  var magnitude = this.dist(0, 0, dst[0], dst[1]);
                  dst[0] /= magnitude;
                  dst[1] /= magnitude;
                  triangle.vel[0] -= dst[0]/10;
                  triangle.vel[1] -= dst[1]/10;
                  player.vel[0] += dst[0]/10;
                  player.vel[1] += dst[1]/10;
              }
            });
            /** Square+Pentagon collisions **
            /*pentagonServer.getPentagons().forEach(pentagon => {
              if (this.dist(player.x, player.y, pentagon.x, pentagon.y) < pentagon.d) {
                  var dst = [player.x - pentagon.x, player.y - pentagon.y];
                  var magnitude = this.dist(0, 0, dst[0], dst[1]);
                  dst[0] /= magnitude;
                  dst[1] /= magnitude;
                  pentagon.vel[0] -= dst[0]/10;
                  pentagon.vel[1] -= dst[1]/10;
                  player.vel[0] += dst[0]/10;
                  player.vel[1] += dst[1]/10;
              }
            });
        */});
        triangleServer.getTriangles().forEach((triangle, ind) => {
            /** Triangle+Bullet collisions **/
            bulletServer.getBullets().forEach((bullet, index) => {
                if (this.dist(bullet.x, bullet.y, triangle.x, triangle.y) < triangle.d) {
                    triangle.vel[0] += bullet.xd * 1.5;
                    triangle.vel[1] += bullet.yd * 1.5;
                    bulletServer.getBullets().splice(index, 1);
                }
            });
            /** Triangle+Triangle collisions **
            triangleServer.getTriangles().forEach(tringle => {
              if (this.dist(player.x, player.y, triangle.x, triangle.y) < triangle.d) {
                  var dst = [player.x - triangle.x, player.y - triangle.y];
                  var magnitude = this.dist(0, 0, dst[0], dst[1]);
                  dst[0] /= magnitude;
                  dst[1] /= magnitude;
                  triangle.vel[0] -= dst[0]/10;
                  triangle.vel[1] -= dst[1]/10;
                  player.vel[0] += dst[0]/10;
                  player.vel[1] += dst[1]/10;
              }
            });
            /** Triangle+Pentagon collisions **
            pentagonServer.getPentagons().forEach(pentagon => {
              if (this.dist(player.x, player.y, pentagon.x, pentagon.y) < pentagon.d) {
                  var dst = [player.x - pentagon.x, player.y - pentagon.y];
                  var magnitude = this.dist(0, 0, dst[0], dst[1]);
                  dst[0] /= magnitude;
                  dst[1] /= magnitude;
                  pentagon.vel[0] -= dst[0]/10;
                  pentagon.vel[1] -= dst[1]/10;
                  player.vel[0] += dst[0]/10;
                  player.vel[1] += dst[1]/10;
              }
            });
        */});
        pentagonServer.getPentagons().forEach((pentagon, ind) => {
            /** Pentagon+Bullet collisions **/
            bulletServer.getBullets().forEach((bullet, index) => {
                if (this.dist(bullet.x, bullet.y, pentagon.x, pentagon.y) < pentagon.d/1.5) {
                    pentagon.vel[0] += bullet.xd * 1.5;
                    pentagon.vel[1] += bullet.yd * 1.5;
                    bulletServer.getBullets().splice(index, 1);
                }
            });
            /** Pentagon+Pentagon collisions **
            pentagonServer.getPentagons().forEach(pentgon => {
              if (this.dist(player.x, player.y, pentagon.x, pentagon.y) < pentagon.d) {
                  var dst = [player.x - pentagon.x, player.y - pentagon.y];
                  var magnitude = this.dist(0, 0, dst[0], dst[1]);
                  dst[0] /= magnitude;
                  dst[1] /= magnitude;
                  pentagon.vel[0] -= dst[0]/10;
                  pentagon.vel[1] -= dst[1]/10;
                  player.vel[0] += dst[0]/10;
                  player.vel[1] += dst[1]/10;
              }
            });
        */});
        playerServer.getPlayers().forEach(player => {
            if(!player.playing) return;
            /** Player+Bullet collisions **/
            bulletServer.getBullets().forEach((bullet, index) => {
                if(bullet.owner === player.id) return;
                if (this.dist(bullet.x, bullet.y, player.x, player.y) < player.d/1.5) {
                    player.vel[0] += bullet.xd * 1.5;
                    player.vel[1] += bullet.yd * 1.5;
                    bulletServer.getBullets().splice(index, 1);
                }
            });
            /** Player+Player collisions **/
            playerServer.getPlayers().forEach(plyr => {
                if(player.id === plyr.id) return;
                if(!plyr.playing) return;
                if (this.dist(player.x, player.y, plyr.x, plyr.y) < plyr.d) {
                    var dst = [player.x - plyr.x, player.y - plyr.y];
                    var magnitude = this.dist(0, 0, dst[0], dst[1]);
                    dst[0] /= magnitude;
                    dst[1] /= magnitude;
                    plyr.vel[0] -= dst[0]/10;
                    plyr.vel[1] -= dst[1]/10;
                    player.vel[0] += dst[0]/10;
                    player.vel[1] += dst[1]/10;
                }
            });
            /** Player+Square collisions **/
            squareServer.getSquares().forEach(square => {
                if (this.dist(player.x, player.y, square.x, square.y) < square.d) {
                    var dst = [player.x - square.x, player.y - square.y];
                    var magnitude = this.dist(0, 0, dst[0], dst[1]);
                    dst[0] /= magnitude;
                    dst[1] /= magnitude;
                    square.vel[0] -= dst[0]/10;
                    square.vel[1] -= dst[1]/10;
                    player.vel[0] += dst[0]/10;
                    player.vel[1] += dst[1]/10;
                }
            });
            /** Player+Triangle collisions **/
            triangleServer.getTriangles().forEach(triangle => {
              if (this.dist(player.x, player.y, triangle.x, triangle.y) < triangle.d) {
                  var dst = [player.x - triangle.x, player.y - triangle.y];
                  var magnitude = this.dist(0, 0, dst[0], dst[1]);
                  dst[0] /= magnitude;
                  dst[1] /= magnitude;
                  triangle.vel[0] -= dst[0]/10;
                  triangle.vel[1] -= dst[1]/10;
                  player.vel[0] += dst[0]/10;
                  player.vel[1] += dst[1]/10;
              }
            });
            /** Player+Pentagon collisions **/
            pentagonServer.getPentagons().forEach(pentagon => {
              if (this.dist(player.x, player.y, pentagon.x, pentagon.y) < pentagon.d) {
                  var dst = [player.x - pentagon.x, player.y - pentagon.y];
                  var magnitude = this.dist(0, 0, dst[0], dst[1]);
                  dst[0] /= magnitude;
                  dst[1] /= magnitude;
                  pentagon.vel[0] -= dst[0]/10;
                  pentagon.vel[1] -= dst[1]/10;
                  player.vel[0] += dst[0]/10;
                  player.vel[1] += dst[1]/10;
              }
            });
        });
    }
};
