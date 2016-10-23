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
    };
    this.initiated = false;
    this.alive = true;
};

bullet.prototype.init = function() {
    this.initiated = true;
};

bullet.prototype.getStats = function() {
    return this.stats;
};

module.exports = bullet;
