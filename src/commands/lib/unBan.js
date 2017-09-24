const banServer = require("../../core/banServer.js");
module.exports = msg => {
    if (!banServer.getBanList().includes(msg[1])) return;
    banList.splice(banServer.getBanList().indexOf(msg[1]), 1);
    banServer.setBanList(banList);
    console.log(`[Console] Unbanned IP ${msg[1]}`);
};
