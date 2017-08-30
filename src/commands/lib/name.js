'use strict';
const playerServer = require("../../core/playerServer.js");
module.exports = msg => {
    var nameW=[];
    for(var i=2; i<msg.length; i++) nameW.push(msg[i]);
    for(var i=0; i<playerServer.getPlayers().length; i++){
        if(playerServer.getPlayers()[i].id !== parseInt(msg[1])) return;
        playerServer.getPlayers()[i].name=nameW.join(" ");
        console.log(`[Console] Changed player ${parseInt(msg[1])}'s name to ${playerServer.getPlayers()[i].name}`);
    }
};
