var Another4096 = Another4096 || {};

Another4096.GameOptions = {
    tileSize: 200,
    tileSpacing: 20,
    boardSize: {
        rows: 4,
        cols: 4
    }
};

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
        width: Another4096.GameOptions.boardSize.cols * (Another4096.GameOptions.tileSize + Another4096.GameOptions.tileSpacing) + Another4096.GameOptions.tileSpacing,
        height: Another4096.GameOptions.boardSize.rows * (Another4096.GameOptions.tileSize + Another4096.GameOptions.tileSpacing) + Another4096.GameOptions.tileSpacing,
        backgroundColor: 0xecf0f1,
        scene: [PreloadScene, GameScene]
    };

    /* Initializing the Phaser 3 framework */
    Another4096.game = new Phaser.Game(Another4096.GameConfig);
    window.focus();
    resizeGame();
    window.addEventListener("resize", resizeGame);
};