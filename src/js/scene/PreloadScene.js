class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        /* Loading images and sprites */
        this.load.image("emptytile", "assets/sprites/emptytile.png");
        this.load.image("gametitle", "assets/sprites/gametitle.png");

        this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
            frameWidth: Another4096.GameOptions.tileSize,
            frameHeight: Another4096.GameOptions.tileSize
        });

        /* Loading sound effect */
        this.load.audio("move", ["assets/sounds/move.ogg", "assets/sounds/move.mp3"]);
        this.load.audio("grow", ["assets/sounds/grow.ogg", "assets/sounds/grow.mp3"]);
    }

    create() {
        this.scene.start("GameScene");
    }
}