'use strict';
var banList = [];

module.exports = {
    getBanList: function() {
        return banList;
    },
    setBanList: function(ips) {
        banList = ips;
    },
    addBan: function(ip){
        banList.push(ip);
    },
    delBan: function(ip){
        banList.splice(ip, 1);
    }
};
