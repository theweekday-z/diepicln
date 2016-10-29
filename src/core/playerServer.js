'use strict';
var players = [];

module.exports = {
    getPlayers: function() {
        return players;
    },
    setPlayers: function(plyrs) {
        players = plyrs;
    },
    addPlayers: function(plyr){
        pentagons.push(plyr);
    },
    addPlayers: function(plyrs){
        pentagons.push(plyrs);
    },
    delPlayer: function(plyr){
        pentagons.splice(plyr, 1);
    }
};
