var bullets = [];
module.exports = {
    getBullets: () => bullets,
    setBullets: blts => bullets = blts,
    addBullet: blt => bullets.push(blt),
    addBullets: blts => bullets.push(blts),
    delBullet: blt => bullets.splice(blt, 1)
};
