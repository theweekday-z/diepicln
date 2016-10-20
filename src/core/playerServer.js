'use strict';
var players = [];

module.exports = {
    getPlayers: function() {
        return players;
    },
    setPlayers: function(plyrs) {
        players = plyrs;
    }
};
