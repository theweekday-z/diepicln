'use strict';
module.exports = class square {
    constructor(x, y, r, d) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.d = d;
        this.vel = [0, 0];
    }

    update() {
        this.r+=0.01;
        this.x += this.vel[0];
        this.y += this.vel[1];
        this.vel[0] -= this.vel[0] / 20;
        this.vel[1] -= this.vel[1] / 20;
    }
}
