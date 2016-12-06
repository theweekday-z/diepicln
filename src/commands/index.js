'use strict';

module.exports = {
    "pluginCommands": {},
    "help": function() {
        console.log("                       ╭────────────────────────────╮                       ");
+       console.log("                       │ LIST OF AVAILABLE COMMANDS │                       ");
+       console.log("╭──────────────────────┴────────────────────────────┴──────────────────────╮");
+       console.log("|                                                                          |");
        console.log("|                                 Vanilla                                  |");
        console.log("|                                ─────────                                 |");
        console.log("|                                                                          |");
+       console.log("│ help                         │ Shows help                                |");
        console.log("| name                         | Changes a player's name                   |");
        console.log("| ban                          | Bans an IP                                |");
        console.log("| exit                         | Closes the server                         |");
        console.log("| banlist                      | Displays banned IPs                       |");
        console.log("| unban                        | Removes a ban                             |");
        console.log("| mute                         | Mutes a user                              |");
        console.log("| mutelist                     | Displays muted users                      |");
        console.log("| unmute                       | unmutes a user                            |");
        console.log("| chat                         | Chat using the console                    |");
        console.log("| tp                           | Teleport a player to any location         |");
        console.log("| kill                         | Kills a player                            |");
+       console.log("|                                                                          |");
        console.log("|                                 Plugins                                  |");
        console.log("|                                ─────────                                 |");
        console.log("|                                                                          |");
        for(var each in this.pluginCommands){
            var str = each.split("");
            while(str.length<29){
                str.push(" ");
            }
            var str2 = this.pluginCommands[each].split("");
            while(str2.length<41){
                str2.push(" ");
            }
            console.log("| "+str.join("")+"| "+str2.join("")+" |");
        }
        console.log("|                                                                          |");
+       console.log("├──────────────────────────────────────────────────────────────────────────┤");
+       console.log('│                             Diepio commands                              |');
+       console.log("╰──────────────────────────────────────────────────────────────────────────╯");
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
    "kill": require("./lib/kill.js"),
    "addbot": require("./lib/addBot.js"),
    "kickbot": require("./lib/kickBot.js")
};
