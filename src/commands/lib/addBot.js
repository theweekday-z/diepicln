'use strict';
const playerServer = require("../../core/playerServer.js"),
    fakePlayer = require("../../AI/fakePlayer.js"),
    server = require("../../server.js");
module.exports = msg => {
    for(var i=0; i<msg[1]; i++){
        playerServer.addPlayer(new fakePlayer(msg[2] || "BOT", 0, 0, server.Id(), require("../../AI/bot.js")));
        server.setId(server.Id()+1);
    }
    console.log("Added %s bot(s)!", msg[1]);
};
