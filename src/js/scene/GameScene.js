class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    init() {
        this.boardArray = [];
        this.canMove = false;
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
                    tileSprite: tile
                }
            }
        }

        this.addTile();
        this.addTile();

        /* Enabled player input method */
        this.input.keyboard.on("keydown", this.handleKey, this);
        this.input.on("pointerup", this.handleSwipe, this);
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
        let movedTiles = 0;

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
                    while (this.isLegalPosition(newRow + dRow, newCol + dCol)) {
                        newRow += dRow;
                        newCol += dCol;
                    }
                    movedTiles++;
                    this.boardArray[curRow][curCol].tileSprite.depth = movedTiles;
                    let newPos = GameScene.getTilePosition(newRow, newCol);
                    this.boardArray[curRow][curCol].tileSprite.x = newPos.x;
                    this.boardArray[curRow][curCol].tileSprite.y = newPos.y;
                    this.boardArray[curRow][curCol].tileValue = 0;

                    /* Merging tiles */
                    if (this.boardArray[newRow][newCol].tileValue === tileValue) {
                        this.boardArray[newRow][newCol].tileValue++;
                        this.boardArray[curRow]
                            [curCol].tileSprite.setFrame(tileValue);
                    }
                    else {
                        this.boardArray[newRow][newCol].tileValue = tileValue;
                    }
                }
            }
        }
    }

    isLegalPosition(row, col) {
        let rowInside = row >= 0 && row < Another4096.GameOptions.boardSize.rows;
        let colInside = col >= 0 && col < Another4096.GameOptions.boardSize.cols;
        return rowInside && colInside;
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