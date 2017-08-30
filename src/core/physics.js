const playerServer = require('./playerServer.js');
const bulletServer = require('./bulletServer.js');
const squareServer = require('./squareServer.js');
const triangleServer = require('./triangleServer.js');
const pentagonServer = require('./pentagonServer.js');
module.exports = {
    dist: function(x1, y1, x2, y2) {
        var a = x1 - x2;
        var b = y1 - y2;

        var c = Math.sqrt( a*a + b*b );

        return c;
    },
    collideWith: function(e, c) {
        if (this.dist(e.x, e.y, c.x, c.y) - (e.d / 2) < c.d / 2) {
            return true;
        } else {
            return false;
        }
    },
    bounceRight: function(entity) {
        entity.x += 1.5;
    },
    bounceLeft: function(entity) {
        entity.x -= 1.5;
    },
    bounceUp: function(entity) {
        entity.y -= 1.5;
    },
    bounceDown: function(entity) {
        entity.y += 1.5;
    },
    collisions: function() {
        squareServer.getSquares().forEach(square=>{
            var data = square;
            for(var i=0; i<bulletServer.getBullets().length; i++){
                if (this.dist(bulletServer.getBullets()[i].x, bulletServer.getBullets()[i].y, data.x, data.y) < data.d/2) {
                    // create knockback
                    data.vel[0] += bulletServer.getBullets()[i].xd * 5;
                    data.vel[1] += bulletServer.getBullets()[i].yd * 5;

                    // delete the projectile that hit the polygon
                    bulletServer.getBullets().splice(i, 1);
                }
            }
        });
        triangleServer.getTriangles().forEach(triangle=>{
            var data = triangle;
            for(var i=0; i<bulletServer.getBullets().length; i++){
                if (this.dist(bulletServer.getBullets()[i].x, bulletServer.getBullets()[i].y, data.x, data.y) < data.d/2) {
                    // create knockback
                    data.vel[0] += bulletServer.getBullets()[i].xd * 5;
                    data.vel[1] += bulletServer.getBullets()[i].yd * 5;

                    // delete the projectile that hit the polygon
                    bulletServer.getBullets().splice(i, 1);
                }
            }
        });
        pentagonServer.getPentagons().forEach(pentagon=>{
            var data = pentagon;
            for(var i=0; i<bulletServer.getBullets().length; i++){
                if (this.dist(bulletServer.getBullets()[i].x, bulletServer.getBullets()[i].y, data.x, data.y) < data.d/2) {
                    // create knockback
                    data.vel[0] += bulletServer.getBullets()[i].xd * 5;
                    data.vel[1] += bulletServer.getBullets()[i].yd * 5;

                    // delete the projectile that hit the polygon
                    bulletServer.getBullets().splice(i, 1);
                }
            }
        });
    }
};
