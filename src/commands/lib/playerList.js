'use strict';
module.exports = () => {
    var players = require("../../core/playerServer.js").getPlayers();
    if (players.length == 0) return console.log("[Console] No players are connected to the server");
    console.log("Showing "+players.length+" Players");
    for(var i=0; i<players.length; i++) console.log(`| ID: ${players[i].id} | Name: ${players[i].name} | x: ${Math.round(players[i].x)} | y: ${Math.round(players[i].y)} | IP: ${players[i].ip} | Playing: ${players[i].playing}`);
};
