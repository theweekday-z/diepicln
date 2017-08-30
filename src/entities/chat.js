const chatServer = require("../core/chatServer.js");
const pluginService = require("../core/pluginService.js");

module.exports = (to, frum,  msg) => {
    pluginService.getPlugins().forEach((plugin)=> {
        plugin.call('beforeChat');
    });
    var message;
    if(to === "all"){
        message = {msg: msg, user: frum, to: "all"};
        chatServer.addMessage(message);
        console.log("[Console] Message Sent To All!");
    } else {
        message = {msg: msg, user: frum, to: to};
        chatServer.addMessage(message);
        console.log("[Console] Message Sent To "+to);
    }
};
