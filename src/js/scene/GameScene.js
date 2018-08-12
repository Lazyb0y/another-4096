class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    init() {
        this.boardArray = [];
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
                duration: Another4096.GameOptions.tweenSpeed
            });
        }
    }
}