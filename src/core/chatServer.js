var messages = [];
const server = require("../server.js");
module.exports = {
    getMessages: () => messages,
    setMessages: msgs => {
        messages = msgs;
        server.updateMessages();
    },
    addMessage: msg => {
        messages.push(msg);
        server.updateMessages();
    },
    addMessages: msgs => {
        messages.push(msgs);
        server.updateMessages();
    },
    delMessage: msg => {
        messages.splice(msg, 1);
        server.updateMessages();
    }
};
