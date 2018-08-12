class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        /* Loading images and sprites */
        this.load.image("emptytile", "assets/sprites/emptytile.png");
        this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
            frameWidth: Another4096.GameOptions.tileSize,
            frameHeight: Another4096.GameOptions.tileSize
        });
    }

    create() {
        this.scene.start("GameScene");
    }
}