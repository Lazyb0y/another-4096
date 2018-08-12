class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        this.load.image("emptytile", "assets/sprites/emptytile.png");
    }

    create() {
        this.scene.start("GameScene");
    }
}