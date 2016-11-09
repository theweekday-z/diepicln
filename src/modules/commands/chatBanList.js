'use strict';
module.exports = function(msg) {
  var chatBanList = require("../../core/chatBanServer.js").getChatBanList();
  for(var each in chatBanList){
      console.log(chatBanList[each]);
  }
};
