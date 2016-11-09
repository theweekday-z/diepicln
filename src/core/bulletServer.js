'use strict';
var bullets = [];
module.exports = {
    getBullets: function() {
        return bullets;
    },
    setBullets: function(blts) {
        bullets = blts;
    },
    addBullet: function(blt){
        bullets.push(blt);
    },
    addBullets: function(blts){
        bullets.push(blts);
    },
    delBullet: function(blt){
        bullets.splice(blt, 1);
    }
};
