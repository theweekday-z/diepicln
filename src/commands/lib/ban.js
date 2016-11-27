'use strict';
const banServer = require("../../core/banServer.js");
const playerServer = require("../../core/playerServer.js");
module.exports = function(msg) {
    var cb=true;
    for(var i=0; i<banServer.getBanList().length; i++){
        if(msg[1]===banServer.getBanList()[i].ip){ cb=false; }
    }
    if(cb){
        banServer.addBan({ip: msg[1]});
        console.log("[Console] Banned IP "+msg[1]);
    } else {
        console.log("[Console] Failed To Ban IP "+msg[1]);
    }
};
