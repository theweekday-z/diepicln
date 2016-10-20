var triangle = function(x, y, r, d) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.d = d;
};

triangle.prototype.update = function() {
    this.r+=0.00025;
};
