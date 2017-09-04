var players = [];
module.exports = {
    getPlayers: () => {return players},
    setPlayers: plyrs => players = plyrs,
    addPlayer: plyr => players.push(plyr),
    addPlayers: plyrs => players.push(plyrs),
    delPlayer: plyr => players.splice(plyr, 1)
};
