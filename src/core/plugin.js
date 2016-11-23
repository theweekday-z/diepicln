'use strict';
const chat = require('../entities/chat.js');

var plugin = function(config) {
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
};

module.exports = plugin;

plugin.prototype.on = function(type, callback) {
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
};

plugin.prototype.call = function(type){
    this[type].forEach((t)=> {
        t();
    });
};

plugin.prototype.emit = function(type, arg) {
    var args = arg.split(" ");
    switch(type){
        case "chat":
            chat("all", "[Console]", args[0]);
            break;
    }
};

plugin.prototype.cmd = function(name, callback){
    this.commands.push({name: name, callback: callback});
};