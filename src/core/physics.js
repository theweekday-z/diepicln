module.exports = {
    dist: function(x1, y1, x2, y2) {
        var a = x1 - x2;
        var b = y1 - y2;

        var c = Math.sqrt( a*a + b*b );

        return c;
    },
    collideWith: function(e, c) {
        if (this.dist(e.x, e.y, c.x, c.y) - (e.d / 2) < c.d / 2) {
            return true;
        } else {
            return false;
        }
    }
};
