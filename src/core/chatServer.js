'use strict';
var messages = [];
module.exports = {
    getMessages: function() {
        return messages;
    },
    setMessages: function(msgs) {
        messages = msgs;
    },
    addMessage: function(msg){
        messages.push(msg);
    },
    addMessages: function(msgs){
        messages.push(msgs);
    },
    delMessage: function(msg){
        messages.splice(msg, 1);
    }
};
