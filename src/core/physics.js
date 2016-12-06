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
        entity.x += 1;
    },
    bounceLeft: function(entity) {
        entity.x -= 1;
    },
    bounceUp: function(entity) {
        entity.y -= 1;
    },
    bounceDown: function(entity) {
        entity.y += 1;
    },
    collisions: function() {
        playerServer.getPlayers().forEach((player) => {
            bulletServer.getBullets().forEach((bullet) => {
                if(this.collideWith(player, bullet) && bullet.owner !== player.id){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(player.x < bullet.x && !r) {
                        this.bounceLeft(player);
                        l=true;
                        return;
                    }
                    if(player.y < bullet.y && !d) {
                        this.bounceUp(player);
                        u=true;
                        return;
                    }
                    if(player.x > bullet.x && !l) {
                        this.bounceRight(player);
                        r=true;
                        return;
                    }
                    if(player.y > bullet.y && !u) {
                        this.bounceDown(player);
                        d=true;
                        return;
                    }
                    return;
                }
            });
            squareServer.getSquares().forEach((square) => {
                if(this.collideWith(player, square)){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(player.x < square.x && !r) {
                        this.bounceLeft(player);
                        this.bounceRight(square);
                        l=true;
                        return;
                    }
                    if(player.y < square.y && !d) {
                        this.bounceUp(player);
                        this.bounceDown(square);
                        u=true;
                        return;
                    }
                    if(player.x > square.x && !l) {
                        this.bounceRight(player);
                        this.bounceLeft(square);
                        r=true;
                        return;
                    }
                    if(player.y > square.y && !u) {
                        this.bounceDown(player);
                        this.bounceUp(square);
                        d=true;
                        return;
                    }
                    return;
                }
            });
            triangleServer.getTriangles().forEach((triangle) => {
                if(this.collideWith(player, triangle)){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(player.x < triangle.x && !r) {
                        this.bounceLeft(player);
                        this.bounceRight(triangle);
                        l=true;
                        return;
                    }
                    if(player.y < triangle.y && !d) {
                        this.bounceUp(player);
                        this.bounceDown(triangle);
                        u=true;
                        return;
                    }
                    if(player.x > triangle.x && !l) {
                        this.bounceRight(player);
                        this.bounceLeft(triangle);
                        r=true;
                        return;
                    }
                    if(player.y > triangle.y && !u) {
                        this.bounceDown(player);
                        this.bounceUp(square);
                        d=true;
                        return;
                    }
                    return;
                }
            });
            pentagonServer.getPentagons().forEach((pentagon) => {
                if(this.collideWith(player, pentagon)){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(player.x < pentagon.x && !r) {
                        this.bounceLeft(player);
                        this.bounceRight(pentagon);
                        l=true;
                        return;
                    }
                    if(player.y < pentagon.y && !d) {
                        this.bounceUp(player);
                        this.bounceDown(pentagon);
                        u=true;
                        return;
                    }
                    if(player.x > pentagon.x && !l) {
                        this.bounceRight(player);
                        this.bounceLeft(pentagon);
                        r=true;
                        return;
                    }
                    if(player.y > pentagon.y && !u) {
                        this.bounceDown(player);
                        this.bounceUp(pentagon);
                        d=true;
                        return;
                    }
                    return;
                }
            });
        });
        squareServer.getSquares().forEach((square) => {
            bulletServer.getBullets().forEach((bullet) => {
                if(this.collideWith(square, bullet)){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(square.x < bullet.x && !r) {
                        this.bounceLeft(square);
                        l=true;
                        return;
                    }
                    if(square.y < bullet.y && !d) {
                        //this.bounceUp(square);
                        this.bounceLeft(square);
                        u=true;
                        return;
                    }
                    if(square.x > bullet.x && !l) {
                        //this.bounceRight(square);
                        this.bounceLeft(square);
                        r=true;
                        return;
                    }
                    if(square.y > bullet.y && !u) {
                        //this.bounceDown(square);
                        this.bounceLeft(square);
                        d=true;
                        return;
                    }
                    return;
                }
            });
            squareServer.getSquares().forEach((squaree) => {
                if(this.collideWith(square, squaree)){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(square.x < squaree.x && !r) {
                        this.bounceLeft(square);
                        this.bounceRight(squaree);
                        l=true;
                        return;
                    }
                    if(square.y < squaree.y && !d) {
                        this.bounceUp(square);
                        this.bounceDown(squaree);
                        u=true;
                        return;
                    }
                    if(square.x > squaree.x && !l) {
                        this.bounceRight(square);
                        this.bounceLeft(squaree);
                        r=true;
                        return;
                    }
                    if(square.y > squaree.y && !u) {
                        this.bounceDown(square);
                        this.bounceUp(squaree);
                        d=true;
                        return;
                    }
                    return;
                }
            });
            triangleServer.getTriangles().forEach((triangle) => {
                if(this.collideWith(square, triangle)){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(square.x < triangle.x && !r) {
                        this.bounceLeft(square);
                        this.bounceRight(triangle);
                        l=true;
                        return;
                    }
                    if(square.y < triangle.y && !d) {
                        this.bounceUp(square);
                        this.bounceDown(triangle);
                        u=true;
                        return;
                    }
                    if(square.x > triangle.x && !l) {
                        this.bounceRight(square);
                        this.bounceLeft(triangle);
                        r=true;
                        return;
                    }
                    if(square.y > triangle.y && !u) {
                        this.bounceDown(square);
                        this.bounceUp(triangle);
                        d=true;
                        return;
                    }
                    return;
                }
            });
            pentagonServer.getPentagons().forEach((pentagon) => {
                if(this.collideWith(square, pentagon)){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(square.x < pentagon.x && !r) {
                        this.bounceLeft(square);
                        this.bounceRight(pentagon);
                        l=true;
                        return;
                    }
                    if(square.y < pentagon.y && !d) {
                        this.bounceUp(square);
                        this.bounceDown(pentagon);
                        u=true;
                        return;
                    }
                    if(square.x > pentagon.x && !l) {
                        this.bounceRight(square);
                        this.bounceLeft(pentagon);
                        r=true;
                        return;
                    }
                    if(square.y > pentagon.y && !u) {
                        this.bounceDown(square);
                        this.bounceUp(pentagon);
                        d=true;
                        return;
                    }
                    return;
                }
            });
        });
        triangleServer.getTriangles().forEach((triangle) => {
            triangleServer.getTriangles().forEach((trianglee) => {
                if(this.collideWith(triangle, trianglee)){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(triangle.x < trianglee.x && !r) {
                        this.bounceLeft(triangle);
                        this.bounceRight(trianglee);
                        l=true;
                        return;
                    }
                    if(triangle.y < trianglee.y && !d) {
                        this.bounceUp(triangle);
                        this.bounceDown(trianglee);
                        u=true;
                        return;
                    }
                    if(triangle.x > trianglee.x && !l) {
                        this.bounceRight(triangle);
                        this.bounceLeft(trianglee);
                        r=true;
                        return;
                    }
                    if(triangle.y > trianglee.y && !u) {
                        this.bounceDown(triangle);
                        this.bounceUp(trianglee);
                        d=true;
                        return;
                    }
                    return;
                }
            });
            bulletServer.getBullets().forEach((bullet) => {
                if(this.collideWith(triangle, bullet)){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(triangle.x < bullet.x && !r) {
                        this.bounceLeft(triangle);
                        l=true;
                        return;
                    }
                    if(triangle.y < bullet.y && !d) {
                        this.bounceUp(triangle);
                        u=true;
                        return;
                    }
                    if(triangle.x > bullet.x && !l) {
                        this.bounceRight(triangle);
                        r=true;
                        return;
                    }
                    if(triangle.y > bullet.y && !u) {
                        this.bounceDown(triangle);
                        d=true;
                        return;
                    }
                    return;
                }
            });
            pentagonServer.getPentagons().forEach((pentagon) => {
                if(this.collideWith(triangle, pentagon)){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(triangle.x < pentagon.x && !r) {
                        this.bounceLeft(triangle);
                        this.bounceRight(pentagon);
                        l=true;
                        return;
                    }
                    if(triangle.y < pentagon.y && !d) {
                        this.bounceUp(triangle);
                        this.bounceDown(pentagon);
                        u=true;
                        return;
                    }
                    if(triangle.x > pentagon.x && !l) {
                        this.bounceRight(triangle);
                        this.bounceLeft(pentagon);
                        r=true;
                        return;
                    }
                    if(triangle.y > pentagon.y && !u) {
                        this.bounceDown(triangle);
                        this.bounceUp(pentagon);
                        d=true;
                        return;
                    }
                    return;
                }
            });
        });
        pentagonServer.getPentagons().forEach((pentagon) => {
            bulletServer.getBullets().forEach((bullet) => {
                if(this.collideWith(pentagon, bullet)){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(pentagon.x < bullet.x && !r) {
                        this.bounceLeft(pentagon);
                        l=true;
                        return;
                    }
                    if(pentagon.y < bullet.y && !d) {
                        this.bounceUp(pentagon);
                        u=true;
                        return;
                    }
                    if(pentagon.x > bullet.x && !l) {
                        this.bounceRight(pentagon);
                        r=true;
                        return;
                    }
                    if(pentagon.y > bullet.y && !u) {
                        this.bounceDown(pentagon);
                        d=true;
                        return;
                    }
                    return;
                }
            });
            pentagonServer.getPentagons().forEach((pentagonn) => {
                if(this.collideWith(pentagon, pentagonn)){
                    var r;
                    var l;
                    var u;
                    var d;
                    if(pentagon.x < pentagonn.x && !r) {
                        this.bounceLeft(pentagon);
                        this.bounceRight(pentagonn);
                        l=true;
                        return;
                    }
                    if(pentagon.y < pentagonn.y && !d) {
                        this.bounceUp(pentagon);
                        this.bounceDown(pentagonn);
                        u=true;
                        return;
                    }
                    if(pentagon.x > pentagonn.x && !l) {
                        this.bounceRight(pentagon);
                        this.bounceLeft(pentagonn);
                        r=true;
                        return;
                    }
                    if(pentagon.y > pentagonn.y && !u) {
                        this.bounceDown(pentagon);
                        this.bounceUp(pentagonn);
                        d=true;
                        return;
                    }
                    return;
                }
            });
        });
    }
};
