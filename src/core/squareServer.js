'use strict';
var squares = [];
module.exports = {
    getSquares: () => {return squares},
    setSquares: sqrs => squares = sqrs,
    addSquare: sqr => squares.push(sqr),
    addSquares: sqrs => squares.push(sqrs),
    delSquare: sqr => squares.splice(sqr, 1)
};
