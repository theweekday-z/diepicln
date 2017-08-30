'use strict';
const banServer = require("../../core/banServer.js"),
    playerServer = require("../../core/playerServer.js");
module.exports = msg => {
    var cb=true;
    for(var i=0; i<banServer.getBanList().length; i++) if(msg[1]===banServer.getBanList()[i].ip) cb=false;
    if(!cb) return console.log("[Console] Failed To Ban IP "+msg[1]);
    banServer.addBan({ip: msg[1]});
    console.log("[Console] Banned IP "+msg[1]);
};
