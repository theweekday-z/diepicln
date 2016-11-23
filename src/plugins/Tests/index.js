'use strict';
const plgn = require('../../core/plugin.js');
var plugin = new plgn({
    name: "Tests",
    author: "SharkFin",
    version: "1.0.0",
    addToHelp: {
        "sayHi": 'Chats "HI!"'
    }
});

var t = 0;

plugin.run = ()=> {
    //Code Here
    if(t<500){
        t+=1;
    } else {
        t=0;
    }
    /*if(t===250){
        plugin.emit("chat", "HI!");
    }*/
};

plugin.on('beforeChat', ()=> {
    //Runs Before A Chat Message Is Sent
    if(plugin.config.beforeChat){
        console.log("Sending Chat Message...");
    }
});

plugin.on('beforeBan', ()=> {
    //Runs Before An IP Gets Banned
    if(plugin.config.beforeBan){
        console.log("Banning An IP...");
    }
});

plugin.on('beforeNewUser', ()=> {
    //Calls Before A New User Enters The Server
    if(plugin.config.beforeNewUser){
        console.log("New User...");
    }
});

plugin.cmd('sayHi', ()=> {
    plugin.emit("chat", "HI!");
});

module.exports = plugin;