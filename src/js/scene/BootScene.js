class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        this.load.image("appicon", "assets/sprites/appicon.png");
    }

    create() {
        this.scene.start("PreloadScene");
    }
}