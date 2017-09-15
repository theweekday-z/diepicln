module.exports = () => {
    var muteList = require("../../core/muteServer.js").getMuteList();
    for(var each in muteList) console.log(muteList[each]);
};
