var Another4096 = Another4096 || {};

/* Resizing the game to cover the wider area possible */
function resizeGame() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = Another4096.game.config.width / Another4096.game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

window.onload = function () {
    Another4096.GameConfig = {
        width: 480,
        height: 640,
        backgroundColor: 0xecf0f1
    };

    /* Initializing the Phaser 3 framework */
    Another4096.game = new Phaser.Game(Another4096.GameConfig);
    window.focus();
    resizeGame();
    window.addEventListener("resize", resizeGame);
};