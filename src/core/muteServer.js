'use strict';
var muteList = [];

module.exports = {
    getMuteList: function() {
        return muteList;
    },
    setMuteList: function(ids) {
        muteList = ids;
    },
    addMute: function(id){
        muteList.push(id);
    },
    delMute: function(id){
        muteList.splice(id, 1);
    }
};