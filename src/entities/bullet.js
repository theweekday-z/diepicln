'use strict';
const bulletServer = require('../core/bulletServer.js');

var bullet = function(x, y, xd, yd, speed, d, damage, penetration, owner){
    this.x = x;
    this.y = y;
    this.xd = xd;
    this.yd = yd;
    this.speed = speed;
    this.d = d;
    this.damage = damage;
    this.penetration = penetration;
    this.owner = owner;
    
    this.t=0;
};

bullet.prototype.update = function() {
    this.x += this.xd*this.speed;
    this.y += this.yd*this.speed;
    this.t++;
    if(this.t>=500){
        bulletServer.getBullets().splice(bulletServer.getBullets().indexOf(this), 1);
    }
};

module.exports = bullet;
