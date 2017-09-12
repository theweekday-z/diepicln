const config = require('../core/configService.js').getConfig();
module.exports = class triangle {
    constructor(x, y, r, d, vel, sdir) {
        this.x = x || ~~(Math.random() * (config.w - 199) + 100);
        this.y = y || ~~(Math.random() * (config.h - 199) + 100);
        this.r = r || ~~(Math.random() * 360);
        this.d = d || 20;
        this.vel = vel || [0, 0];
        this.hp = 30;
        this.sdir = sdir || Math.random(0,1) <= 0.5 ? 0.005 : -0.005;

        this.xdir = Math.random() * (0.125 - -0.125) - 0.125;
        this.ydir = Math.random() * (0.125 - -0.125) - 0.125;
    }

    move() {
        this.x += this.xdir;
        this.y += this.ydir;
    }

    spin() {
        this.r += this.sdir;
    }

    update() {
        this.move();
        this.spin();
        this.x += this.vel[0];
        this.y += this.vel[1];
        this.vel[0] -= this.vel[0] / 20;
        this.vel[1] -= this.vel[1] / 20;
    }
}
