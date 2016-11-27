'use strict';
const playerServer = require("../../core/playerServer.js");
module.exports = function(msg) {
    for(var i=0; i<playerServer.getPlayers().length; i++){
        if(playerServer.getPlayers()[i].id===parseInt(msg[1])){
            playerServer.getPlayers()[i].x = 0;
            playerServer.getPlayers()[i].y = 0;
            playerServer.getPlayers()[i].playing = false;
            console.log("[Console] Killed player "+parseInt(msg[1]));
        }
    }
};