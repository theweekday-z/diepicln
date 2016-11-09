'use strict';

var bullet = function(x, y, xd, yd, speed, d, damage, penetration, owner){
    this.x = x,
    this.y = y,
    this.xd = xd,
    this.yd = yd,
    this.speed = speed,
    this.d = d,
    this.damage = damage,
    this.penetration = penetration
    this.alive = true;
    this.owner = owner;
};

bullet.prototype.update = function() {
    this.x += this.xd*this.speed;
    this.y += this.yd*this.speed;
};

module.exports = bullet;
