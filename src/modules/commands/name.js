'use strict';
const playerServer = require("../../core/playerServer.js");
module.exports = function(msg) {
    var nameW=[];
    for(var i=2; i<msg.length; i++){
        nameW.push(msg[i]);
    }
    for(var i=0; i<playerServer.getPlayers().length; i++){
        if(playerServer.getPlayers()[i].id===parseInt(msg[1])){
          playerServer.getPlayers()[i].name=nameW;
          console.log("[Console] Changed player "+parseInt(msg[1])+"'s name to "+playerServer.getPlayers()[i].name);
        }
    }
};
