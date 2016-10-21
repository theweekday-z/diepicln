'use strict';
const glob = require('glob');
const fs = require('fs');
const ini = require('../modules/ini.js');

var config = {
    port: 3000, //Game Port
    w: 6000, //World Width
    h: 6000, //World Height
    minimumSquares: 75, //Minimum Amount Of Squares
    minimumTriangles: 50, //Minimum Amount Of Triangles
    minimumPentagons: 10, //Minimum Amount Of Pentagons
    maxSquares: 175, //Maximum Amount Of Squares
    maxTriangles: 125, //Maximum Amount Of Triangles
    maxPentagons: 75, //Maximum Amount Of Pentagons
    chatMaxMessageLength: 70, //Length of messages in chat
    chatIntervalTime: 2500, //ms between each message
    chatBlockedWords: "fuck;bitch", //Words to filter from chat
    clientMaxName: 15, //Number of maximum characters in the name box
    clientTitle: "" //The Title That The Client Uses
};

module.exports = {
    getConfig: function() {
        return config;
    },
    init: function() {
        this.loadConfig();
    },
    loadConfig: function() {
        let configFiles = glob.sync(__dirname + "/../settings/*.ini");
        if (configFiles.length===0) {
          console.log("No config files found");
        }
        configFiles.forEach((file)=> {
            try {
                console.log('Loading ' + file);
                // Load the contents of the config file
                let load = ini.parse(fs.readFileSync(file, 'utf-8'));
                // Replace all the default config's values with the loaded config's values
                for (let obj in load) {
                    config[obj] = load[obj];
                }
            } catch (err) {
                console.warn("Error while loading: " + file + " error: " + err);
            }
        });
    }
};
