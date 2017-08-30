'use strict';
var pentagons = [];
module.exports = {
    getPentagons: () => {return pentagons},
    setPentagons: pnts => pentagons = pnts,
    addPentagon: pnt => pentagons.push(pnt),
    addPentagons: pnts => pentagons.push(pnts),
    delPentagon: pnt => pentagons.splice(pnt, 1)
};
