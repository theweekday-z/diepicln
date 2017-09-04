var bullets = [];
module.exports = {
    getBullets: () => {return bullets},
    setBullets: blts => bullets = blts,
    addBullet: blt => bullets.push(blt),
    addBullets: blts => bullets.push(blts),
    delBullet: blt => bullets.splice(blt, 1)
};
