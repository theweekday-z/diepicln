'use strict';
const glob = require('glob');
const fs = require('fs');
const ini = require('../modules/ini.js');

var plugins = [];

module.exports = {
    getPlugins: () => {return plugins},
    init: () => {
        //Find Plugins
        if (!fs.existsSync('./plugins')) {
            console.log('[\x1b[31mINFO\x1b[0m] plugins Folder Not Found. Generating...');
            fs.mkdir('./plugins');
            console.log('[\x1b[32mINFO\x1b[0m] plugins Folder Generated!');
        }

        // try running
        let plgns = glob.sync(__dirname + "/../plugins/*/index.js");
        console.log("[\x1b[34mINFO\x1b[0m] Loading Plugins...");
        if(plgns.length<0) console.log("[\x1b[34mINFO\x1b[0m] No Plugins Found");
        plgns.forEach(plugin => {
            try {
                const plgn = require(plugin);
                plugins.push(plgn);
                console.log('[\x1b[32mOK\x1b[0m] Loaded Plugin ' + plgn.name + " v" + plgn.version + " By " + plgn.author);
            } catch (err) {
                console.warn("Error while loading: " + plugin + " error: " + err);
            }
        });
        //
        plugins.forEach(plugin => {
            const commandList = require('../commands/index.js');
            for(var each in plugin.addToHelp) commandList.pluginCommands[each] = plugin.addToHelp[each];
            for(var each in plugin.commands){
                if(!commandList[plugin.commands[each].name]){
                    commandList[plugin.commands[each].name] = plugin.commands[each].callback;
                } else {
                    console.log('[Console] Command "'+plugin.commands[each].name+'" From Plugin '+plugin.name+" Could not be added because it already exists in another plugin.");
                }
            }
        });
        //
        plugins.forEach(plugin => {
            let configFiles = glob.sync(__dirname + "/../plugins/"+plugin.name+"/*.ini");
            var configs = {};
            configFiles.forEach(file => {
                try {
                    //console.log('[\x1b[34mINFO\x1b[0m] Loading ' + file);
                    let load = ini.parse(fs.readFileSync(file, 'utf-8'));
                    for (let obj in load) configs[obj] = load[obj];
                    //console.log(load);
                } catch (err) {
                    //console.warn("Error while loading: " + file + " error: " + err);
                }
            });
            plugin.config = configs;
        });
    }
};
