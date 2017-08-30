'use strict';
var triangles = [];
module.exports = {
    getTriangles: () => {return triangles},
    setTriangles: tris => triangles = tris,
    addTriangle: tri => triangles.push(tri),
    addTriangles: tris => triangles.push(tris),
    delTriangle: tri => triangles.splice(tri, 1)
};
