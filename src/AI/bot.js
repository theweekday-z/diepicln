'use strict';
const playerServer = require('../core/playerServer.js');
const config = require('../core/configService.js').getConfig();
var dist = function(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;

    var c = Math.sqrt( a*a + b*b );

    return c;
};
module.exports = function(id) {
    for(var each in playerServer.getPlayers()) {
        if(playerServer.getPlayers()[each].id===id){
            var bot = playerServer.getPlayers()[each];
            if(!bot.playing){
                bot.x = ~~(Math.random() * (config.w-100 - 100 + 1) + 100);
                bot.y = ~~(Math.random() * (config.h-100 - 100 + 1) + 100);
                bot.playing = true;
            }
            playerServer.getPlayers().forEach((player) => {
                if(dist(player.x, player.y, bot.x, bot.y) <= 200 && player.id !== id){
                    bot.r+=0.025;
                    if(player.x < bot.x){
                        bot.keyMap[39] = true;;
                    } else {
                        bot.keyMap[39] = false;
                    }
                    if(player.y < bot.y){
                        bot.keyMap[40] = true;
                    } else {
                        bot.keyMap[40] = false;
                    }
                    if(player.x > bot.x){
                        bot.keyMap[37] = true;
                    } else {
                        bot.keyMap[37] = false;
                    }
                    if(player.y > bot.y){
                        bot.keyMap[38] = true;
                    } else {
                        bot.keyMap[38] = false;
                    }
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