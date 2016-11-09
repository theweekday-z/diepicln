'use strict';
var player = function(name, x, y, xvel, yvel, moving, lvl, score, r, d, id, ip){
    this.name = name;
    this.x = x;
    this.y = y;
    this.xvel = xvel;
    this.yvel = yvel;
    this.moving = false;
    this.lvl = lvl;
    this.score = score;
    this.r = r;
    this.d = d;
    this.id = id;
    this.ip = ip;
};

player.prototype.update = function() {
    this.x+=this.xvel;
    this.y+=this.yvel;
    if(!this.moving){
        this.xvel/=1.05;
        this.yvel/=1.05;
    } else {
        if(this.xvel > 1){
            this.xvel = 1;
        }
        if(this.yvel > 1){
            this.yvel = 1;
        }
        if(this.xvel < -1){
            this.xvel = -1;
        }
        if(this.yvel < -1){
            this.yvel = -1;
        }
    }
};

module.exports = player;
