'use strict';
const muteServer = require("../../core/muteServer.js");
const chat = require("../../entities/chat.js");
module.exports = msg => {
    for(var i=0; i<muteServer.getMuteList().length; i++){
        if(msg[1] !== muteServer.getMuteList()[i].toString()) return;
        muteServer.getMuteList().splice(i, 1);
        chat(parseInt(msg[1]), "[Server]", "You Have Been unmuted.");
        console.log(`[Console] Removed ${msg[1]}'s mute.`);
    }
};
