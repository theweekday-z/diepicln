module.exports = function() {
    var banList = require("../../core/banServer.js").getBanList();
    for(var each in banList){
        console.log(banList[each].ip);
    }
};
