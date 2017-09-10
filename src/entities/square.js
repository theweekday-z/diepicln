const config = require('../core/configService.js').getConfig();
module.exports = class square {
    constructor(x, y, r, d, vel, sdir) {
        this.x = x || ~~(Math.random() * (config.w-100 - 100 + 1) + 100);
        this.y = y || ~~(Math.random() * (config.h-100 - 100 + 1) + 100);
        this.r = r || ~~(Math.random() * (360));
        this.d = d || 35;
        this.vel = vel || [0, 0];
        this.hp = 10;
        this.sdir = sdir || Math.random(0,1) <= 0.5 ? 0.005 : -0.005;

        this.xdir = Math.random() * 0.25 - 0.125;
        this.ydir = Math.random() * 0.25 - 0.125;
    }

    update() {
        this.x += this.xdir;
        this.y += this.ydir;
        this.r += this.sdir;
        this.x += this.vel[0];
        this.y += this.vel[1];
        this.vel[0] -= this.vel[0] / 20;
        this.vel[1] -= this.vel[1] / 20;
    }
}
