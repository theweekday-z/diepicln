const playerServer = require("../../core/playerServer.js");
module.exports = msg => {
    for(var i=0; i<playerServer.getPlayers().length; i++){
        if(playerServer.getPlayers()[i].id !== parseInt(msg[1])) return;
        playerServer.getPlayers()[i].playing = false;
        console.log(`[Console] Killed player ${parseInt(msg[1])}`);
    }
};
