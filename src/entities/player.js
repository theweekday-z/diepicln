const config = require('../core/configService.js').getConfig(),
    bulletServer = require('../core/bulletServer.js'),
    bullet = require('./ammunition/bullet.js');
module.exports = class player {
    constructor(id, ip, sid) {
        this.nick = '';
        this.x = 0;
        this.y = 0;
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
                value: 5
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

    setHealthRegen(level) {
        level ? this.stats.healthRegen.level = level : this.stats.healthRegen.level++;
    }

    setMaxHealth(level) {
        level ? this.stats.maxHealth.level = level : this.stats.maxHealth.level++;
        this.stats.maxHealth.value = (50 + (2 * this.level - 1)) + (20 * this.stats.maxHealth.level);
    }

    setBodyDamage(level) {
        level ? this.stats.bodyDamage.level = level : this.stats.bodyDamage.level++;
        this.stats.bodyDamage.value = 20 + (4 * this.stats.bodyDamage.level);
    }

    setBulletSpeed(level) {
        level ? this.stats.bulletSpeed.level = level : this.stats.bulletSpeed.level++;
    }

    setBulletPenetration(level) {
        level ? this.stats.bulletPenetration.level = level : this.stats.bulletPenetration.level++;
    }

    setBulletDamage(level) {
        level ? this.stats.bulletDamage.level = level : this.stats.bulletDamage.level++;
        this.stats.bulletDamage.value = 7 + (3 * this.stats.bulletDamage.level);
    }

    setReload(level) {
        level ? this.stats.reload.level = level : this.stats.reload.level++;
    }

    setMovementSpeed(level) {
        level ? this.stats.movementSpeed.level = level : this.stats.movementSpeed.level++;
    }

    setNick(nick) {
        this.nick = nick;
    }

    move() {
        this.x += this.vel[0];
        this.y += this.vel[1];
    }

    shoot(xd, yd) {
        bulletServer.addBullet(new bullet(this.x, this.y, xd, yd, this.stats.bulletSpeed.value, this.id));
    }

    update() {
        this.move();
        this.vel[0] /= 1.015;
        this.vel[1] /= 1.015;
        if (this.vel[0] > this.stats.movementSpeed.value) this.vel[0] = this.stats.movementSpeed.value;
        if (this.vel[1] > this.stats.movementSpeed.value) this.vel[1] = this.stats.movementSpeed.value;
        if (this.vel[0] < -this.stats.movementSpeed.value) this.vel[0] = -this.stats.movementSpeed.value;
        if (this.vel[1] < -this.stats.movementSpeed.value) this.vel[1] = -this.stats.movementSpeed.value;
        if (this.x > config.w) this.x = config.w;
        if (this.y > config.h) this.y = config.h;
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.chatting) return;
        if (this.keyMap[38] || this.keyMap[87]) this.vel[1] -= 0.025;
        if (this.keyMap[40] || this.keyMap[83]) this.vel[1] += 0.025;
        if (this.keyMap[39] || this.keyMap[68]) this.vel[0] += 0.025;
        if (this.keyMap[37] || this.keyMap[65]) this.vel[0] -= 0.025;
    }
}
