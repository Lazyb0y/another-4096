class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    create() {
        this.scene.start("GameScene");
    }
}