const chatServer = require("../core/chatServer.js");

module.exports = function(to, frum,  msg){
    var messages = chatServer.getMessages();
    if(to==="all"){
        var message = {msg: msg, user: frum, to: "all"};
        messages.push(message);
        chatServer.setMessages(messages);
        console.log("Message Sent To All!");
    } else {
        var message = {msg: msg, user: frum, to: to};
        messages.push(message);
        chatServer.setMessages(messages);
        console.log("Message Sent To "+to);
    }
};
