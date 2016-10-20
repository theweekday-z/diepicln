'use strict';
var bullets = [];

module.exports = {
    getBullets: function() {
        return bullets;
    },
    setBullets: function(blts) {
        bullets = blts;
    }
};
