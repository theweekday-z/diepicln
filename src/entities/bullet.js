'use strict';

var bullet = function(x, y, xd, yd, speed, d, damage, penetration){
    this.x = x,
    this.y = y,
    this.xd = xd,
    this.yd = yd,
    this.speed = speed,
    this.d = d,
    this.damage = damage,
    this.penetration = penetration

    this.alive = true;
};

bullet.prototype.update = function() {
    this.x += this.xd;
    this.y += this.yd;
};

module.exports = bullet;
