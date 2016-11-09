'use strict';
var chatBanList = [];

module.exports = {
    getChatBanList: function() {
        return chatBanList;
    },
    setChatBanList: function(ids) {
        chatBanList = ids;
    },
    addChatBan: function(id){
        chatBanList.push(id);
    },
    delChatBan: function(id){
        chatBanList.splice(id, 1);
    }
};
