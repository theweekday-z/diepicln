const banServer = require("../../core/banServer.js"),
    playerServer = require("../../core/playerServer.js");
module.exports = msg => {
    if(banServer.getBanList().includes(msg[1])) return console.log(`[Console] Failed To Ban IP ${msg[1]}`);
    banServer.addBan(msg[1]);
    console.log(`[Console] Banned IP ${msg[1]}`);
};
