'use strict';
const muteServer = require("../../core/muteServer.js");
const chat = require("../../entities/chat.js");
module.exports = function(msg) {
    for(var i=0; i<muteServer.getMuteList().length; i++){
        if(msg[1]===muteServer.getMuteList()[i].toString()){
            muteServer.getMuteList().splice(i, 1);
            chat(parseInt(msg[1]), "[Server]", "You Have Been unBanned From Chatting.");
            console.log("[Console] Unbanned User "+msg[1]+" From Chatting.");
        }
    }
};
