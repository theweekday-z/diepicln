'use strict';
var players = [];

module.exports = {
    getPlayers: function() {
        return players;
    },
    setPlayers: function(plyrs) {
        players = plyrs;
    },
    addPlayer: function(plyr){
        players.push(plyr);
    },
    addPlayers: function(plyrs){
        players.push(plyrs);
    },
    delPlayer: function(plyr){
        players.splice(plyr, 1);
    }
};
