'use strict';
var messages = [];

module.exports = {
    getMessages: function() {
        return messages;
    },
    setMessages: function(msgs) {
        messages = msgs;
    }
};
