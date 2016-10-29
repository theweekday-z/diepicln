'use strict';

var pentagon = function(x, y, r, d) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.d = d;
};

pentagon.prototype.update = function() {
    this.r+=0.00025;
};

module.exports = pentagon;
