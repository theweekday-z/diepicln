'use strict';

var bullet = function(x, y, xd, yd, speed, d, damage, penetration){
    this.stats = {
        x: x,
        y: y,
        xd: xd,
        yd: yd,
        speed: speed,
        d: d,
        damage: damage,
        penetration: penetration
    }
    this.initiated = false;
};

bullet.prototype.init = function() {
    setInterval(this.update, 0);
    this.initiated = true;
};

bullet.prototype.getStats = function() {
    return this.stats;
};

bullet.prototype.update = function() {
    //this.stats.x += this.stats.xd;
    //this.stats.y += this.stats.yd;
};

module.exports = bullet;
