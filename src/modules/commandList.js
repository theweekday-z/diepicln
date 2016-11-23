'use strict';

module.exports = {
    "pluginCommands": {},
    "help": function() {
        console.log("[Console] ============================== HELP ============================");
        console.log("[Console] help            : Shows help");
        console.log("[Console] name            : Changes a player's name");
        console.log("[Console] ban             : Bans An IP");
        console.log("[Console] exit            : Closes The Server");
        console.log("[Console] banlist         : Displays All Bans");
        console.log("[Console] unban           : Removes A Ban");
        console.log("[Console] mute            : Bans A User From Chatting");
        console.log("[Console] mutelist        : Displays muted users");
        console.log("[Console] removechatban   : Lets A User Chat Again After Being Banned");
        console.log("[Console] chat            : Chat Using The Console");
        console.log("[Console] tp              : Teleport A Player To Any Location");
        for(var each in this.pluginCommands){
            var str = each.split("");
            while(str.length<15){
                str.push(" ");
            }
            console.log("[Console] "+str.join("")+" : "+this.pluginCommands[each]);
        }
    },
    "name": require("./commands/name.js"),
    "playerlist": require("./commands/playerList.js"),
    "ban": require("./commands/ban.js"),
    "exit": require("./commands/exit.js"),
    "banlist": require("./commands/banList.js"),
    "unban": require("./commands/unBan.js"),
    "mute": require("./commands/mute.js"),
    "mutelist": require("./commands/muteList.js"),
    "unmute": require("./commands/unMute"),
    "chat": require("./commands/chat.js"),
    "tp": require("./commands/tp.js")
};