'use strict';
var player = function(name, x, y, xvel, yvel, speed, lvl, score, r, d, id, ip){
    this.name = name;
    this.x = x;
    this.y = y;
    this.xvel = xvel;
    this.yvel = yvel;
    this.lvl = lvl;
    this.score = score;
    this.speed = speed;
    this.r = r;
    this.d = d;
    this.id = id;
    this.ip = ip;
};

player.prototype.update = function() {
    var config = require("../core/configService.js").getConfig();
    this.x+=this.xvel*2;
    this.y+=this.yvel*2;
    this.xvel/=1.005;
    this.yvel/=1.005;
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
    if(this.x>config.w){
        this.x=config.w;
    }
    if(this.y>config.h){
        this.y=config.h;
    }
    if(this.x<0){
        this.x=0;
    }
    if(this.y<0){
        this.y=0;
    }
};

module.exports = player;
