'use strict';
const bulletServer = require('../core/bulletServer.js'),
    config = require('../core/configService.js').getConfig();
module.exports = class bullet {
    constructor(x, y, xd, yd, speed, d, damage, penetration, owner) {
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
    }

    update() {
        this.x += this.xd*this.speed;
        this.y += this.yd*this.speed;
        this.t++;
        if(this.t>=250 || this.x < 0 || this.y < 0 || this.x > config.w || this.y > config.h) bulletServer.getBullets().splice(bulletServer.getBullets().indexOf(this), 1);
    }
}
