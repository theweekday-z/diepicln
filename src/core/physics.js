const playerServer = require('./playerServer.js'),
    server = require('../server.js'),
    bulletServer = require('./bulletServer.js');
module.exports = {
    dist(x1, y1, x2, y2) {
        var a = x1 - x2;
        var b = y1 - y2;
        var c = Math.sqrt(a * a + b * b);
        return c;
    },
    collisions() {
        var squares = server.getSquares(),
            triangles = server.getTriangles(),
            pentagons = server.getPentagons();
        squares.forEach((square, ind) => {
            /** Square+Bullet collisions **/
            bulletServer.getBullets().forEach((bullet, index) => {
                if(bullet.dying) return;
                if (this.dist(bullet.x, bullet.y, square.x, square.y) < square.d/1.5) {
                    square.vel[0] += bullet.xd * 1.5;
                    square.vel[1] += bullet.yd * 1.5;
                    bullet.dying = true;
                }
            });
            /** Square+Square collisions **/
            squares.forEach((sqre, index) => {
                if(ind===index) return;
                if (this.dist(square.x, square.y, sqre.x, sqre.y) < sqre.d) {
                    var dst = [square.x - sqre.x, square.y - sqre.y];
                    var magnitude = this.dist(0, 0, dst[0], dst[1]);
                    dst[0] /= magnitude;
                    dst[1] /= magnitude;
                    sqre.vel[0] -= dst[0]/10;
                    sqre.vel[1] -= dst[1]/10;
                    square.vel[0] += dst[0]/10;
                    square.vel[1] += dst[1]/10;
                }
            });
            /** Square+Triangle collisions **/
            triangles.forEach(triangle => {
              if (this.dist(square.x, square.y, triangle.x, triangle.y) < triangle.d) {
                  var dst = [square.x - triangle.x, square.y - triangle.y];
                  var magnitude = this.dist(0, 0, dst[0], dst[1]);
                  dst[0] /= magnitude;
                  dst[1] /= magnitude;
                  triangle.vel[0] -= dst[0]/10;
                  triangle.vel[1] -= dst[1]/10;
                  square.vel[0] += dst[0]/10;
                  square.vel[1] += dst[1]/10;
              }
            });
            /** Square+Pentagon collisions **/
            pentagons.forEach(pentagon => {
              if (this.dist(square.x, square.y, pentagon.x, pentagon.y) < pentagon.d) {
                  var dst = [square.x - pentagon.x, square.y - pentagon.y];
                  var magnitude = this.dist(0, 0, dst[0], dst[1]);
                  dst[0] /= magnitude;
                  dst[1] /= magnitude;
                  pentagon.vel[0] -= dst[0]/10;
                  pentagon.vel[1] -= dst[1]/10;
                  square.vel[0] += dst[0]/10;
                  square.vel[1] += dst[1]/10;
              }
            });
        });
        triangles.forEach((triangle, ind) => {
            /** Triangle+Bullet collisions **/
            bulletServer.getBullets().forEach((bullet, index) => {
                if(bullet.dying) return;
                if (this.dist(bullet.x, bullet.y, triangle.x, triangle.y) < triangle.d) {
                    triangle.vel[0] += bullet.xd * 1.5;
                    triangle.vel[1] += bullet.yd * 1.5;
                    bullet.dying = true;
                }
            });
            /** Triangle+Triangle collisions **/
            triangles.forEach((tringle, index) => {
                if(ind === index) return;
                if (this.dist(triangle.x, triangle.y, tringle.x, tringle.y) < tringle.d) {
                    var dst = [triangle.x - tringle.x, triangle.y - tringle.y];
                    var magnitude = this.dist(0, 0, dst[0], dst[1]);
                    dst[0] /= magnitude;
                    dst[1] /= magnitude;
                    tringle.vel[0] -= dst[0]/10;
                    tringle.vel[1] -= dst[1]/10;
                    triangle.vel[0] += dst[0]/10;
                    triangle.vel[1] += dst[1]/10;
                }
            });
            /** Triangle+Pentagon collisions **/
            pentagons.forEach(pentagon => {
              if (this.dist(triangle.x, triangle.y, pentagon.x, pentagon.y) < pentagon.d) {
                  var dst = [triangle.x - pentagon.x, triangle.y - pentagon.y];
                  var magnitude = this.dist(0, 0, dst[0], dst[1]);
                  dst[0] /= magnitude;
                  dst[1] /= magnitude;
                  pentagon.vel[0] -= dst[0]/10;
                  pentagon.vel[1] -= dst[1]/10;
                  triangle.vel[0] += dst[0]/10;
                  triangle.vel[1] += dst[1]/10;
              }
            });
        });
        pentagons.forEach((pentagon, ind) => {
            /** Pentagon+Bullet collisions **/
            bulletServer.getBullets().forEach((bullet, index) => {
                if(bullet.dying) return;
                if (this.dist(bullet.x, bullet.y, pentagon.x, pentagon.y) < pentagon.d/1.5) {
                    pentagon.vel[0] += bullet.xd * 1.5;
                    pentagon.vel[1] += bullet.yd * 1.5;
                    bullet.dying = true;
                }
            });
            /** Pentagon+Pentagon collisions **/
            pentagons.forEach((pentgon, index) => {
              if(ind === index) return;
              if (this.dist(pentagon.x, pentagon.y, pentgon.x, pentgon.y) < pentgon.d) {
                  var dst = [pentagon.x - pentgon.x, pentagon.y - pentgon.y];
                  var magnitude = this.dist(0, 0, dst[0], dst[1]);
                  dst[0] /= magnitude;
                  dst[1] /= magnitude;
                  pentgon.vel[0] -= dst[0]/10;
                  pentgon.vel[1] -= dst[1]/10;
                  pentagon.vel[0] += dst[0]/10;
                  pentagon.vel[1] += dst[1]/10;
              }
            });
        });
        playerServer.getPlayers().forEach(player => {
            if(!player.playing) return;
            /** Player+Bullet collisions **/
            bulletServer.getBullets().forEach((bullet, index) => {
                if(bullet.owner === player.id) return;
                if(bullet.dying) return;
                if (this.dist(bullet.x, bullet.y, player.x, player.y) < player.d/1.5) {
                    player.vel[0] += bullet.xd * 1.5;
                    player.vel[1] += bullet.yd * 1.5;
                    bullet.dying = true;
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
            squares.forEach(square => {
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
            triangles.forEach(triangle => {
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
            pentagons.forEach(pentagon => {
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
        if(squares.length === 0 || triangles.length === 0 || pentagons.length === 0) return;
        server.enemyServer.send({type: 'set', call: 'setSquares', data: squares});
        server.setTriangles.send({type: 'set', call: 'setTriangles', data: triangles});
        server.setPentagons.send({type: 'set', call: 'setPentagons', data: pentagons});
    }
};
