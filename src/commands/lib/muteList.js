'use strict';
module.exports = function(msg) {
  var muteList = require("../../core/muteServer.js").getMuteList();
  for(var each in muteList){
      console.log(muteList[each]);
  }
};
