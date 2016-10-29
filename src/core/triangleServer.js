'use strict';
var triangles = [];

module.exports = {
    getTriangles: function() {
        return triangles;
    },
    setTriangles: function(tris) {
        triangles = tris;
    },
    addTriangle: function(tri){
        triangles.push(tri);
    },
    addTriangles: function(tris){
        triangles.push(tris);
    },
    delTriangle: function(tri){
        triangles.splice(tri, 1);
    }
};
