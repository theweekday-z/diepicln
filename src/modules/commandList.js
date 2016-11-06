'use strict';

module.exports = {
    "help": function() {
        console.log("-------------------------------------------");
        console.log("|    Command    :       What It Does      |");
        console.log("| help          : Displays Help           |");
        console.log("| name          : Changes A Player's Name |");
    },
    "name": require("./commands/name.js"),
    "playerlist": require("./commands/playerList.js"),
    "ban": require("./commands/ban.js")
};
