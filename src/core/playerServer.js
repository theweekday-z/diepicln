var players = [];
module.exports = {
    getPlayers: () => players,
    setPlayers: plyrs => players = plyrs,
    addPlayer: plyr => players.push(plyr),
    addPlayers: plyrs => players.push(plyrs),
    delPlayer: plyr => players.splice(plyr, 1)
};
