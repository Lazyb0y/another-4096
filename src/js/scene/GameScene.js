class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    init() {
        this.boardArray = [];
        this.canMove = false;
        this.movingTiles = 0;

        this.score = 0;
        this.scoreBuffer = 0;
        this.bestScore = 0;

        this.scoreText = null;
        this.bestScoreText = null;
    }

    create() {
        /* Initializing blank board */
        for (let i = 0; i < Another4096.GameOptions.boardSize.rows; i++) {
            this.boardArray[i] = [];
            for (let j = 0; j < Another4096.GameOptions.boardSize.cols; j++) {
                let tilePosition = GameScene.getTilePosition(i, j);
                this.add.image(tilePosition.x, tilePosition.y, "emptytile");
                let tile = this.add.sprite(tilePosition.x, tilePosition.y, "tiles", 0);
                tile.visible = false;
                this.boardArray[i][j] = {
                    tileValue: 0,
                    tileSprite: tile,
                    upgraded: false
                }
            }
        }

        /* Adding UI images */
        let gameTitle = this.add.image(10, 5, "gametitle");
        gameTitle.setOrigin(0, 0);

        let howTo = this.add.image(Another4096.game.config.width, 5, "howtoplay");
        howTo.setOrigin(1, 0);

        let scoreXY = GameScene.getTilePosition(-0.8, 1);
        this.add.image(scoreXY.x, scoreXY.y, "scorepanel");
        this.add.image(scoreXY.x, scoreXY.y - 70, "scorelabels");

        let textXY = GameScene.getTilePosition(-0.92, -0.4);
        this.scoreText = this.add.bitmapText(textXY.x, textXY.y, "font", "0");

        let bestScoreTextXY = GameScene.getTilePosition(-0.92, 1.1);
        this.bestScoreText = this.add.bitmapText(bestScoreTextXY.x, bestScoreTextXY.y, "font", "0");

        let restartXY = GameScene.getTilePosition(-0.8, Another4096.GameOptions.boardSize.cols - 1);
        let restartButton = this.add.sprite(restartXY.x, restartXY.y, "restart");
        restartButton.setInteractive();
        restartButton.on("pointerdown", function () {
            this.scene.start("GameScene");
        }, this);

        let logo = this.add.sprite(Another4096.game.config.width / 2, Another4096.game.config.height, "logo");
        logo.setOrigin(0.5, 1);
        logo.setInteractive();
        logo.on("pointerdown", function () {
            window.location.href = "https://github.com/Lazyb0y/"
        });

        /* Initializing sounds */
        this.moveSound = this.sound.add("move");
        this.growSound = this.sound.add("grow");

        /* Showing best score from local storage */
        this.bestScore = localStorage.getItem(Another4096.GameOptions.storage.bestScore);
        if (this.bestScore == null) {
            this.bestScore = 0;
        }
        this.bestScoreText.text = this.bestScore.toString();

        this.addTile();
        this.addTile();

        /* Enabled player input method */
        this.input.keyboard.on("keydown", this.handleKey, this);
        this.input.on("pointerup", this.handleSwipe, this);
    }

    update() {
        /* While there is score in the score buffer, add it to the actual score */
        if (this.scoreBuffer > 0) {
            this.incrementScore();
            this.scoreBuffer--;
        }
    }

    incrementScore() {
        this.score++;
        this.scoreText.text = this.score.toString();

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.bestScoreText.text = this.bestScore.toString();
            localStorage.setItem(Another4096.GameOptions.storage.bestScore, this.bestScore);
        }
    }

    createScoreAnimation(x, y, message, score) {
        let scoreFont = "40px Arial";

        /* Create a new label for the score */
        let scoreAnimation = this.add.text(x, y, message, {
            font: scoreFont,
            fill: "#39d179",
            stroke: "#ffffff",
            strokeThickness: 15
        });
        scoreAnimation.setOrigin(0.5, 0);
        scoreAnimation.align = 'center';

        /* Tween this score label to the total score label */
        this.tweens.add({
            targets: [scoreAnimation],
            x: this.scoreText.x + 35,
            y: this.scoreText.y - 5,
            duration: 800,
            callbackScope: this,
            onComplete: function () {
                scoreAnimation.destroy();
                this.scoreBuffer += score;
            }
        });
    }

    /**
     * Gives tiles position in pixel based on row and column in pixel
     * @param   {int} row           Row number
     * @param   {int} col           Column number
     * @returns {Phaser.Geom.Point} Calculated tile's position in pixel
     */
    static getTilePosition(row, col) {
        let posX = Another4096.GameOptions.tileSpacing * (col + 1) + Another4096.GameOptions.tileSize * (col + 0.5);
        let posY = Another4096.GameOptions.tileSpacing * (row + 1) + Another4096.GameOptions.tileSize * (row + 0.5);

        let boardHeight = Another4096.GameOptions.boardSize.rows * Another4096.GameOptions.tileSize;
        boardHeight += (Another4096.GameOptions.boardSize.rows + 1) * Another4096.GameOptions.tileSpacing;
        let offsetY = (Another4096.game.config.height - boardHeight) / 2;
        posY += offsetY;

        return new Phaser.Geom.Point(posX, posY);
    }

    addTile() {
        let emptyTiles = [];

        /* Finding all empty tiles */
        for (let i = 0; i < Another4096.GameOptions.boardSize.rows; i++) {
            for (let j = 0; j < Another4096.GameOptions.boardSize.cols; j++) {
                if (this.boardArray[i][j].tileValue === 0) {
                    emptyTiles.push({
                        row: i,
                        col: j
                    })
                }
            }
        }

        if (emptyTiles.length > 0) {
            /* Randomly selecting a tile and showing in board as Tile 2 */
            let chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);
            this.boardArray[chosenTile.row][chosenTile.col].tileValue = 1;
            this.boardArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
            this.boardArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
            this.boardArray[chosenTile.row][chosenTile.col].tileSprite.alpha = 0;

            /* Showing tile appearing animation */
            this.tweens.add({
                targets: [this.boardArray[chosenTile.row][chosenTile.col].tileSprite],
                alpha: 1,
                duration: Another4096.GameOptions.tweenSpeed,
                callbackScope: this,
                onComplete: function () {
                    this.canMove = true;
                }
            });
        }
    }

    makeMove(d) {
        this.canMove = false;
        this.movingTiles = 0;

        /*  Calculation the direction to move along rows and columns */
        let dRow = (d === Another4096.SwipeDirection.Left || d === Another4096.SwipeDirection.Right) ? 0 : d === Another4096.SwipeDirection.Up ? -1 : 1;
        let dCol = (d === Another4096.SwipeDirection.Up || d === Another4096.SwipeDirection.Down) ? 0 : d === Another4096.SwipeDirection.Left ? -1 : 1;

        /* Determining row and column index to ignore 1st row/column  */
        let firstRow = (d === Another4096.SwipeDirection.Up) ? 1 : 0;
        let lastRow = Another4096.GameOptions.boardSize.rows - ((d === Another4096.SwipeDirection.Down) ? 1 : 0);
        let firstCol = (d === Another4096.SwipeDirection.Left) ? 1 : 0;
        let lastCol = Another4096.GameOptions.boardSize.cols - ((d === Another4096.SwipeDirection.Right) ? 1 : 0);

        for (let i = firstRow; i < lastRow; i++) {
            for (let j = firstCol; j < lastCol; j++) {
                let curRow = dRow === 1 ? (lastRow - 1) - i : i;
                let curCol = dCol === 1 ? (lastCol - 1) - j : j;
                let tileValue = this.boardArray[curRow][curCol].tileValue;
                if (tileValue !== 0) {
                    let newRow = curRow;
                    let newCol = curCol;
                    while (this.isLegalPosition(newRow + dRow, newCol + dCol, tileValue)) {
                        newRow += dRow;
                        newCol += dCol;
                    }

                    if (newRow !== curRow || newCol !== curCol) {
                        let newPos = GameScene.getTilePosition(newRow, newCol);
                        let willUpdate = this.boardArray[newRow][newCol].tileValue === tileValue;
                        this.moveTile(this.boardArray[curRow][curCol].tileSprite, newPos, willUpdate);
                        this.boardArray[curRow][curCol].tileValue = 0;

                        /* Merging tiles */
                        if (willUpdate) {
                            this.boardArray[newRow][newCol].tileValue++;
                            this.boardArray[newRow][newCol].upgraded = true;

                        }
                        else {
                            this.boardArray[newRow][newCol].tileValue = tileValue;
                        }
                    }
                }
            }
        }

        if (this.movingTiles === 0) {
            this.canMove = true;
        }
        else {
            this.moveSound.play();
        }
    }

    moveTile(tile, point, upgrade) {
        this.movingTiles++;
        tile.depth = this.movingTiles;
        let distance = Math.abs(tile.x - point.x) + Math.abs(tile.y - point.y);
        this.tweens.add({
            targets: [tile],
            x: point.x,
            y: point.y,
            duration: Another4096.GameOptions.tweenSpeed * distance / Another4096.GameOptions.tileSize,
            callbackScope: this,
            onComplete: function () {
                if (upgrade) {
                    this.upgradeTile(tile);
                }
                else {
                    this.endTween(tile);
                }
            }
        })
    }

    upgradeTile(tile) {
        this.growSound.play();
        tile.setFrame(tile.frame.name + 1);
        this.tweens.add({
            targets: [tile],
            scaleX: 1.1,
            scaleY: 1.1,
            duration: Another4096.GameOptions.tweenSpeed,
            yoyo: true,
            repeat: 1,
            callbackScope: this,
            onComplete: function () {
                this.endTween(tile);
            }
        })
    }

    endTween(tile) {
        this.movingTiles--;
        tile.depth = 0;
        if (this.movingTiles === 0) {
            this.refreshBoard();
        }
    }

    isLegalPosition(row, col, value) {
        let rowInside = row >= 0 && row < Another4096.GameOptions.boardSize.rows;
        let colInside = col >= 0 && col < Another4096.GameOptions.boardSize.cols;
        if (!rowInside || !colInside) {
            return false;
        }

        /* Limiting tile value to “4096” */
        if (this.boardArray[row][col].tileValue === 12) {
            return false;
        }

        let emptySpot = this.boardArray[row][col].tileValue === 0;
        let sameValue = this.boardArray[row][col].tileValue === value;
        let alreadyUpgraded = this.boardArray[row][col].upgraded;
        return emptySpot || (sameValue && !alreadyUpgraded);
    }

    refreshBoard() {
        for (let i = 0; i < Another4096.GameOptions.boardSize.rows; i++) {
            for (let j = 0; j < Another4096.GameOptions.boardSize.cols; j++) {
                let spritePosition = GameScene.getTilePosition(i, j);
                this.boardArray[i][j].tileSprite.x = spritePosition.x;
                this.boardArray[i][j].tileSprite.y = spritePosition.y;
                let tileValue = this.boardArray[i][j].tileValue;
                if (tileValue > 0) {
                    this.boardArray[i][j].tileSprite.visible = true;
                    this.boardArray[i][j].tileSprite.setFrame(tileValue - 1);

                    if (this.boardArray[i][j].upgraded) {
                        let scoreToAdd = Math.pow(2, tileValue);
                        let tileSprite = this.boardArray[i][j].tileSprite;
                        this.createScoreAnimation(tileSprite.x, tileSprite.y, '+' + scoreToAdd, scoreToAdd);
                    }
                    this.boardArray[i][j].upgraded = false;
                }
                else {
                    this.boardArray[i][j].tileSprite.visible = false;
                }
            }
        }

        this.addTile();
    }

    handleKey(e) {
        if (this.canMove) {
            switch (e.code) {
                case "KeyA":
                case "ArrowLeft":
                    this.makeMove(Another4096.SwipeDirection.Left);
                    break;
                case "KeyD":
                case "ArrowRight":
                    this.makeMove(Another4096.SwipeDirection.Right);
                    break;
                case "KeyW":
                case "ArrowUp":
                    this.makeMove(Another4096.SwipeDirection.Up);
                    break;
                case "KeyS":
                case "ArrowDown":
                    this.makeMove(Another4096.SwipeDirection.Down);
                    break;
            }
        }
    }

    handleSwipe(e) {
        if (this.canMove) {
            let swipeTime = e.upTime - e.downTime;
            let fastEnough = swipeTime < Another4096.GameOptions.swipe.maxTime;
            let swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
            let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
            let longEnough = swipeMagnitude > Another4096.GameOptions.swipe.minDistance;
            if (longEnough && fastEnough) {
                Phaser.Geom.Point.SetMagnitude(swipe, 1);
                if (swipe.x > Another4096.GameOptions.swipe.minNormal) {
                    this.makeMove(Another4096.SwipeDirection.Right);
                }
                if (swipe.x < -Another4096.GameOptions.swipe.minNormal) {
                    this.makeMove(Another4096.SwipeDirection.Left);
                }
                if (swipe.y > Another4096.GameOptions.swipe.minNormal) {
                    this.makeMove(Another4096.SwipeDirection.Down);
                }
                if (swipe.y < -Another4096.GameOptions.swipe.minNormal) {
                    this.makeMove(Another4096.SwipeDirection.Up);
                }
            }
        }
    }
}