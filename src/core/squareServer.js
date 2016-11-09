'use strict';
var squares = [];
module.exports = {
    getSquares: function() {
        return squares;
    },
    setSquares: function(sqrs) {
        squares = sqrs;
    },
    addSquare: function(sqr){
        squares.push(sqr);
    },
    addSquares: function(sqrs){
        squares.push(sqrs);
    },
    delSquare: function(sqr){
        squares.splice(sqr, 1);
    }
};
