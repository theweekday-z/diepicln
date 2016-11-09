'use strict';
var pentagons = [];
module.exports = {
    getPentagons: function() {
        return pentagons;
    },
    setPentagons: function(pnts) {
        pentagons = pnts;
    },
    addPentagon: function(pnt){
        pentagons.push(pnt);
    },
    addPentagons: function(pnts){
        pentagons.push(pnts);
    },
    delPentagon: function(pnt){
        pentagons.splice(pnt, 1);
    }
};
