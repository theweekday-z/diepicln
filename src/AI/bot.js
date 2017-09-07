const playerServer = require('../core/playerServer.js'),
    bulletServer = require('../core/bulletServer.js'),
    entities = require('../entities/index.js'),
    config = require('../core/configService.js').getConfig();
var dist = (x1, y1, x2, y2) => {
    var a = x1 - x2;
    var b = y1 - y2;
    var c = Math.sqrt( a*a + b*b );
    return c;
};
module.exports = bot => {
    if(!bot.playing){
        bot.x = ~~(Math.random() * (config.w - 199) + 100);
        bot.y = ~~(Math.random() * (config.h - 199) + 100);
        bot.playing = true;
    }
    playerServer.getPlayers().forEach(player => {
        if(dist(player.x, player.y, bot.x, bot.y) <= 200 && player.id !== bot.id){
            bot.r = Math.atan2(bot.y - player.y, bot.x - player.x) + Math.PI/2;
            var r = Math.atan2(bot.y - player.y, bot.x - player.x) + Math.PI;
            //bulletServer.addBullet(new entities.bullet(bot.x, bot.y, Math.cos(r), Math.sin(r), 5, 19, 1, 1, id));
            if (player.x < bot.x) bot.vel[0] += 0.025;
            if (player.y < bot.y) bot.vel[1] += 0.025;
            if (player.x > bot.x) bot.vel[0] -= 0.025;
            if (player.y > bot.y) bot.vel[1] -= 0.025;
        }
    });
};
