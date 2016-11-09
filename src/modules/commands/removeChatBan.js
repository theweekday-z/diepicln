'use strict';
const chatBanServer = require("../../core/chatBanServer.js");
const chat = require("../../entities/chat.js");
module.exports = function(msg) {
    for(var i=0; i<chatBanServer.getChatBanList().length; i++){
        if(msg[1]===chatBanServer.getChatBanList()[i].toString()){
            var chatBanList = chatBanServer.getChatBanList();
            chatBanList.splice(i, 1);
            chatBanServer.setChatBanList(chatBanList);
            chat(parseInt(msg[1]), "[Server]", "You Have Been unBanned From Chatting.");
            console.log("[Console] Unbanned User "+msg[1]+" From Chatting.");
        }
    }
};
