var Another4096 = Another4096 || {};

window.onload = function () {
    Another4096.GameConfig = {
        width: 480,
        height: 640,
        backgroundColor: 0xecf0f1
    };

    /* Initializing the Phaser 3 framework */
    Another4096.game = new Phaser.Game(Another4096.GameConfig);
};