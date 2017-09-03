'use strict';
const bulletServer = require('../core/bulletServer.js'),
    config = require('../core/configService.js').getConfig();
module.exports = class bullet {
    constructor(x, y, xd, yd, owner) {
      this.x = x;
      this.y = y;
      this.xd = xd;
      this.yd = yd;
      this.speed = 5;
      this.d = 19;
      this.damage = 1;
      this.penetration = 1;
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
