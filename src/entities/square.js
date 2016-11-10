'use strict';

var square = function(x, y, r, d) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.d = d;
};

square.prototype.update = function() {
    this.r+=0.01;
};

module.exports = square;
