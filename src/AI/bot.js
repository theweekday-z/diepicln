'use strict';
const playerServer = require('../core/playerServer.js'),
    config = require('../core/configService.js').getConfig();
var dist = (x1, y1, x2, y2) => {
    var a = x1 - x2;
    var b = y1 - y2;
    var c = Math.sqrt( a*a + b*b );
    return c;
};
module.exports = id => {
    for(var each in playerServer.getPlayers()) {
        if(playerServer.getPlayers()[each].id === id) {
            var bot = playerServer.getPlayers()[each];
            if(!bot.playing){
                bot.x = ~~(Math.random() * (config.w-100 - 100 + 1) + 100);
                bot.y = ~~(Math.random() * (config.h-100 - 100 + 1) + 100);
                bot.playing = true;
            }
            playerServer.getPlayers().forEach(player => {
                if(dist(player.x, player.y, bot.x, bot.y) <= 200 && player.id !== id){
                    bot.r = Math.atan2(bot.x - player.x, bot.y - player.y) * 180 / Math.PI + 180;
                    bot.keyMap[39] = (player.x < bot.x);
                    bot.keyMap[40] = (player.y < bot.y);
                    bot.keyMap[37] = (player.x > bot.x);
                    bot.keyMap[38] = (player.y > bot.y);
                } else {
                    bot.keyMap[37] = false;
                    bot.keyMap[38] = false;
                    bot.keyMap[39] = false;
                    bot.keyMap[40] = false;
                }
            });
        }
    }
};
