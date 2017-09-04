const playerServer = require("../../core/playerServer.js");
module.exports = msg => {
    for(var i=0; i<playerServer.getPlayers().length; i++){
        if(playerServer.getPlayers()[i].id !== parseInt(msg[1])) break;
        playerServer.getPlayers()[i] = {x: parseInt(msg[2]), y: parseInt(msg[3])};
        console.log(`[Console] Teleported ${playerServer.getPlayers()[i].name} to ${playerServer.getPlayers()[i].x}, ${playerServer.getPlayers()[i].y}`);
    }
};
