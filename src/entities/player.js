const config = require('../core/configService.js').getConfig();
module.exports = class player {
    constructor(name, x, y, id, ip, sid) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.vel = [0, 0];
        this.level = 0;
        this.score = 0;
        this.r = 0;
        this.d = 40;
        this.id = id;
        this.ip = ip;
        this.keyMap = {};
        this.chatting = false;
        this.playing = false;
        this.sid = sid;
        this.stats = {
            healthRegen: {
                level: 0,
                value: 1
            },
            maxHealth: {
                level: 0,
                value: 50 + (2 * this.level - 1)
            },
            bodyDamage: {
                level: 0,
                value: 20
            },
            bulletSpeed: {
                level: 0,
                value: 1
            },
            bulletPenetration: {
                level: 0,
                value: 1
            },
            bulletDamage: {
                level: 0,
                value: 7
            },
            reload: {
                level: 0,
                value: 0
            },
            movementSpeed: {
                level: 0,
                value: 2
            }
        }
    }

    setHealthRegen() {
        //
    }

    setMaxHealth(level) {
        level ? this.stats.maxHealth.level = level : this.stats.maxHealth.level++;
        return this.stats.maxHealth.value = (50 + (2 * this.level - 1)) + (20 * this.stats.maxHealth.level);
    }

    setBodyDamage() {
        //
    }

    setBulletSpeed() {
        //
    }

    setBulletPenetration() {
        //
    }

    setBulletDamage() {
        //
    }

    setReload() {
        //
    }

    setMovementSpeed() {
        //
    }

    move() {
      this.x += this.vel[0];
      this.y += this.vel[1];
    }

    update() {
        this.move();
        this.vel[0]/=1.015;
        this.vel[1]/=1.015;
        if (this.vel[0] > this.stats.movementSpeed.value) this.vel[0] = this.stats.movementSpeed.value;
        if (this.vel[1] > this.stats.movementSpeed.value) this.vel[1] = this.stats.movementSpeed.value;
        if (this.vel[0] < -this.stats.movementSpeed.value) this.vel[0] = -this.stats.movementSpeed.value;
        if (this.vel[1] < -this.stats.movementSpeed.value) this.vel[1] = -this.stats.movementSpeed.value;
        if (this.x>config.w) this.x=config.w;
        if (this.y>config.h) this.y=config.h;
        if (this.x<0) this.x=0;
        if (this.y<0) this.y=0;
        if (this.chatting) return;
        if (this.keyMap[38] || this.keyMap[87]) this.vel[1] -= 0.025;
        if (this.keyMap[40] || this.keyMap[83]) this.vel[1] += 0.025;
        if (this.keyMap[39] || this.keyMap[68]) this.vel[0] += 0.025;
        if (this.keyMap[37] || this.keyMap[65]) this.vel[0] -= 0.025;
    }
}
