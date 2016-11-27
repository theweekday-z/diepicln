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
        console.log("[Console] kill            : Kills a player")
        for(var each in this.pluginCommands){
            var str = each.split("");
            while(str.length<15){
                str.push(" ");
            }
            console.log("[Console] "+str.join("")+" : "+this.pluginCommands[each]);
        }
    },
    "name": require("./lib/name.js"),
    "playerlist": require("./lib/playerList.js"),
    "ban": require("./lib/ban.js"),
    "exit": require("./lib/exit.js"),
    "banlist": require("./lib/banList.js"),
    "unban": require("./lib/unBan.js"),
    "mute": require("./lib/mute.js"),
    "mutelist": require("./lib/muteList.js"),
    "unmute": require("./lib/unMute"),
    "chat": require("./lib/chat.js"),
    "tp": require("./lib/tp.js"),
    "kill": require("./lib/kill.js")
};