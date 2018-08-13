class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        /* Showing loading icon */
        let appIcon = this.add.image(Another4096.game.config.width / 2, Another4096.game.config.height / 4, "appicon");
        appIcon.setOrigin(0.5, 0.5);

        /* Adding and configuring progress bar */
        this.setupProgressBar();

        /* Loading images and sprites */
        this.load.image("emptytile", "assets/sprites/emptytile.png");
        this.load.image("gametitle", "assets/sprites/gametitle.png");
        this.load.image("howtoplay", "assets/sprites/howtoplay.png");
        this.load.image("scorelabels", "assets/sprites/scorelabels.png");
        this.load.image("scorepanel", "assets/sprites/scorepanel.png");
        this.load.image("restart", "assets/sprites/restart.png");
        this.load.image("logo", "assets/sprites/logo.png");

        this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
            frameWidth: Another4096.GameOptions.tileSize,
            frameHeight: Another4096.GameOptions.tileSize
        });

        /* Loading sound effect */
        this.load.audio("move", ["assets/sounds/move.ogg", "assets/sounds/move.mp3"]);
        this.load.audio("grow", ["assets/sounds/grow.ogg", "assets/sounds/grow.mp3"]);

        /* Loading font */
        this.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
    }

    create() {
        this.scene.start("GameScene");
    }

    setupProgressBar() {
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x34495e, 0.8);
        progressBox.fillRect(Another4096.game.config.width / 4, Another4096.game.config.height / 2, Another4096.game.config.width / 2, 50);

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        /* Initializing text for progress status */
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 30,
            text: 'Loading...',
            style: {
                font: '34px monospace',
                fill: '#16a085'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 25,
            text: '0%',
            style: {
                font: '30px monospace',
                fill: '#16a085'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 80,
            text: '',
            style: {
                font: '30px monospace',
                fill: '#16a085'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        /* Load modules callback */
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x34495e, 1);
            progressBar.fillRect(Another4096.game.config.width / 4 + 20, Another4096.game.config.height / 2 + 10, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }
}