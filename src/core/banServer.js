'use strict';
var banList = [];
const server = require("../server.js");
module.exports = {
    getBanList: function() {
        return banList;
    },
    setBanList: function(ips) {
        banList = ips;
        server.ban();
    },
    addBan: function(ip){
        require('./pluginService.js').getPlugins().forEach((plugin)=> {
            plugin.call('beforeBan');
        });
        banList.push(ip);
        server.ban();
    },
    delBan: function(ip){
        banList.splice(ip, 1);
    }
};
