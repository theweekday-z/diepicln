const config = require('../core/configService.js').getConfig();
module.exports = class pentagon {
    constructor(x, y, r, d, vel, sdir) {
        this.x = x || ~~(Math.random() * (config.w-100 - 100 + 1) + 100);
        this.y = y || ~~(Math.random() * (config.h-100 - 100 + 1) + 100);
        this.r = r || ~~(Math.random() * (360 - 0 + 1) + 0);
        this.d = d || 60;
        this.vel = vel || [0, 0];
        this.hp = 100;
        this.sdir = sdir || Math.random(0,1) <= 0.5 ? 0.01 : -0.01;
    }

    update() {
        this.r += this.sdir;
        this.x += this.vel[0];
        this.y += this.vel[1];
        this.vel[0] -= this.vel[0] / 20;
        this.vel[1] -= this.vel[1] / 20;
    }
}
