'use strict';
var messages = [];
const server = require("../server.js");
module.exports = {
    getMessages: function() {
        return messages;
    },
    setMessages: function(msgs) {
        messages = msgs;
        server.updateMessages();
    },
    addMessage: function(msg){
        messages.push(msg);
        server.updateMessages();
    },
    addMessages: function(msgs){
        messages.push(msgs);
        server.updateMessages();
    },
    delMessage: function(msg){
        messages.splice(msg, 1);
        server.updateMessages();
    }
};
