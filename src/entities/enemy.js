const config = require('../core/configService.js').getConfig();
module.exports = class square {
    constructor(x, y, r, d, vel, hp, sdir) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.d = d;
        this.vel = vel;
        this.hp = hp;
        this.sdir = sdir;

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
