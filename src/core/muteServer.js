var muteList = [];
module.exports = {
    getMuteList: () => muteList,
    setMuteList: ids => muteList = ids,
    addMute: id => muteList.push(id),
    delMute: id => muteList.splice(id, 1)
};
