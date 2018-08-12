class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    create() {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                this.add.image(120 + j * 220, 120 + i * 220, "emptytile");
            }
        }
    }
}