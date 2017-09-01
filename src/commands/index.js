'use strict';

module.exports = {
    "pluginCommands": {},
    "help": () => {
        console.log("\n"+
        "                       ╭────────────────────────────╮                       \n"+
        "                       │ LIST OF AVAILABLE COMMANDS │                       \n"+
        "╭──────────────────────┴────────────────────────────┴──────────────────────╮\n"+
        "|                                                                          |\n"+
        "|                                 Vanilla                                  |\n"+
        "|                                ─────────                                 |\n"+
        "|                                                                          |\n"+
        "│ help                         │ Shows help                                |\n"+
        "| name                         | Changes a player's name                   |\n"+
        "| ban                          | Bans an IP                                |\n"+
        "| exit                         | Closes the server                         |\n"+
        "| banlist                      | Displays banned IPs                       |\n"+
        "| unban                        | Removes a ban                             |\n"+
        "| mute                         | Mutes a user                              |\n"+
        "| mutelist                     | Displays muted users                      |\n"+
        "| unmute                       | unmutes a user                            |\n"+
        "| chat                         | Chat using the console                    |\n"+
        "| tp                           | Teleport a player to any location         |\n"+
        "| kill                         | Kills a player                            |\n"+
        "|                                                                          |\n"+
        "|                                 Plugins                                  |\n"+
        "|                                ─────────                                 |\n"+
        "|                                                                          |");
        for(var each in this.pluginCommands){
            var str = each.split("");
            while(str.length<29){
                str.push(" ");
            }
            var str2 = this.pluginCommands[each].split("");
            while(str2.length<41){
                str2.push(" ");
            }
            console.log(`| ${str.join("")}| ${str2.join("")} |`);
        }
        console.log("|                                                                          |\n"+
        "├──────────────────────────────────────────────────────────────────────────┤\n"+
        "│                             Diepio commands                              |\n"+
        "╰──────────────────────────────────────────────────────────────────────────╯");
    },
    "name": require("./lib/name.js"),
    "playerlist": require("./lib/playerList.js"),
    "ban": require("./lib/ban.js"),
    "exit": () => process.exit(0),
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
