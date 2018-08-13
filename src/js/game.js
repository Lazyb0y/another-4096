var Another4096 = Another4096 || {};

Another4096.GameOptions = {
    tileSize: 200,
    tileSpacing: 20,
    boardSize: {
        rows: 4,
        cols: 4
    },
    tweenSpeed: 50,
    swipe: {
        maxTime: 1000,
        minDistance: 20,
        minNormal: 0.85
    },
    aspectRatio: 16 / 9,
    storage: {
        bestScore: "bestScore"
    }
};

Another4096.SwipeDirection = {
    Left: 0,
    Right: 1,
    Up: 2,
    Down: 3
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
    let tileAndSpacing = Another4096.GameOptions.tileSize + Another4096.GameOptions.tileSpacing;
    let width = Another4096.GameOptions.boardSize.cols * tileAndSpacing;
    width += Another4096.GameOptions.tileSpacing;

    Another4096.GameConfig = {
        width: width,
        height: width * Another4096.GameOptions.aspectRatio,
        backgroundColor: 0xecf0f1,
        scene: [BootScene, PreloadScene, GameScene]
    };

    /* Initializing the Phaser 3 framework */
    Another4096.game = new Phaser.Game(Another4096.GameConfig);
    window.focus();
    resizeGame();
    window.addEventListener("resize", resizeGame);
};