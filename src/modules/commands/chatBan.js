'use strict';
const chatBanServer = require("../../core/chatBanServer.js");
const playerServer = require("../../core/playerServer.js");
const chat = require("../../entities/chat.js");
module.exports = function(msg) {
    var cb=false;
    for(var i=0; i<playerServer.getPlayers().length; i++){
        if(parseInt(msg[1])===playerServer.getPlayers()[i].id){ cb=true; }
    }
    for(var i=0; i<chatBanServer.getChatBanList().length; i++){
        if(parseInt(msg[1])===chatBanServer.getChatBanList()[i]){ cb=false; }
    }
    if(cb){
        chatBanServer.addChatBan(parseInt(msg[1]));
        chat(parseInt(msg[1]), "[Server]", "You Have Been Banned From Chatting.");
        console.log("[Console] Banned Player "+parseInt(msg[1])+" From Chatting.");
    } else {
        console.log("[Console] Failed To Ban Player "+parseInt(msg[1])+" From Chatting.");
    }
};
