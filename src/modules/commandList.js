'use strict';

module.exports = {
    "help": function() {
       console.log("[Console] ============================== HELP ============================");
       console.log("[Console] help           : Shows help");
       console.log("[Console] name           : Changes a player's name");
       console.log("[Console] ban            : Bans An IP");
       console.log("[Console] exit           : Closes The Server");
       console.log("[Console] banlist        : Displays All Bans");
       console.log("[Console] unban          : Removes A Ban");
       console.log("[Console] chatban        : Bans A User From Chatting");
       console.log("[Console] chatbanlist    : Displays Users That Can't Chat");
       console.log("[Console] removechatban  : Lets A User Chat Again After Being Banned");
       console.log("[Console] chat           : Chat Using The Console");
    },
    "name": require("./commands/name.js"),
    "playerlist": require("./commands/playerList.js"),
    "ban": require("./commands/ban.js"),
    "exit": require("./commands/exit.js"),
    "banlist": require("./commands/banList.js"),
    "unban": require("./commands/unBan.js"),
    "chatban": require("./commands/chatBan.js"),
    "chatbanlist": require("./commands/chatBanList.js"),
    "removechatban": require("./commands/removeChatBan"),
    "chat": require("./commands/chat.js")
};
