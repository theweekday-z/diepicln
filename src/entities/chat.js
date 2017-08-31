const chatServer = require("../core/chatServer.js");
    pluginService = require("../core/pluginService.js");
module.exports = (to, frum,  msg) => {
    pluginService.getPlugins().forEach(plugin => plugin.call('beforeChat'));
    if(to === "all") chatServer.addMessage({msg: msg, user: frum, to: "all"});
    else chatServer.addMessage({msg: msg, user: frum, to: to});
};
