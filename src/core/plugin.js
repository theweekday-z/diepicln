const chat = require('../entities/chat.js');
module.exports = class plugin {
    constructor(config) {
        this.name = config.name;
        this.author = config.author;
        this.version = config.version;
        this.addToHelp = config.addToHelp;
        this.commands = [];
        this.beforeChat = [];
        this.beforeNewUser = [];
        this.beforeBan = [];
        this.beforeChatBan = [];
        this.config = {};
    }

    on(type, callback) {
        switch(type){
            case "beforeChat":
                this.beforeChat.push(callback);
                break;
            case "beforeNewUser":
                this.beforeNewUser.push(callback);
                break;
            case "beforeBan":
                this.beforeBan.push(callback);
                break;
            case "beforeChatBan":
                this.beforeChatBan.push(callback);
                break;
        }
    }

    call(type) {
        this[type].forEach(t => t());
    }

    emit(type, arg) {
        var args = arg.split(" ");
        switch(type){
            case "chat":
                chat("all", "[Console]", args[0]);
                break;
        }
    }

    cmd(name, callback) {
        this.commands.push({name: name, callback: callback});
    }
}
