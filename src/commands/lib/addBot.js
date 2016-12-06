'use strict';
const playerServer = require("../../core/playerServer.js");
const fakePlayer = require("../../AI/fakePlayer.js");
const server = require("../../server.js");
module.exports = function(msg) {
    for(var i=0; i<msg[1]; i++){
        playerServer.addPlayer(new fakePlayer(msg[2] || "BOT", 0, 0, server.Id, require("../../AI/bot.js")));
        server.updateIds();
    }
    console.log("Added %s bot(s)!", msg[1]);
};
