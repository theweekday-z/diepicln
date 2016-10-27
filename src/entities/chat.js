const chatServer = require("../core/chatServer.js");

module.exports = function(to, frum,  msg){
    if(to==="all"){
        var message = {msg: msg, user: frum, to: "all"};
        chatServer.addMessage(message);
        console.log("Message Sent To All!");
    } else {
        var message = {msg: msg, user: frum, to: to};
        chatServer.addMessage(message);
        console.log("Message Sent To "+to);
    }
};
