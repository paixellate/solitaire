import * as THREE from "three";
import { Input } from "./input";
import { Board } from "./board";
import { TableauPile } from "./piles/tableauPile";
import { SelectionPile } from "./piles/selectionPile";
import { StockPile } from "./piles/stockPile";
import { WastePile } from "./piles/wastePile";
import { FoundationPile } from "./piles/foundationPile";
import { Select } from "./rules/select";
import { Drop } from "./rules/drop";

export class Game {
    private readonly board: Board;
    private readonly stockPile: StockPile;
    private readonly wastePile: WastePile;
    private readonly tableauPiles: TableauPile[];
    private readonly foundationPiles: FoundationPile[];
    private readonly selectionPile: SelectionPile;

    constructor() {
        this.board = new Board();
        this.stockPile = this.board.createStockPile();
        this.wastePile = this.board.createWastePile();
        this.tableauPiles = this.board.createTableauPiles();
        this.foundationPiles = this.board.createFoundationPiles();
        this.selectionPile = this.board.createSelectionPile();
        this.board.dealCards(this.board.createDeck(), this.stockPile, this.tableauPiles);
    }

    public addToScene(scene: THREE.Scene): void {
        this.stockPile.addToScene(scene);
        this.wastePile.addToScene(scene);
        this.tableauPiles.forEach((pile) => pile.addToScene(scene));
        this.foundationPiles.forEach((pile) => pile.addToScene(scene));
        this.selectionPile.addToScene(scene);
    }

    public mainLoop(input: Input): void {
        const selection = this.selectionPile.getSelection();
        if (input.mouse.isDown) {
            if (!input.mouse.wasDown && !selection) {
                const select = new Select();
                this.selectionPile.setSelection(
                    select.select(input.mouse.position, this.wastePile, this.stockPile, this.tableauPiles, this.foundationPiles)
                );
            } else if (selection) {
                this.selectionPile.moveWithCursor(input.mouse.position);
            }
        } else if (input.mouse.wasDown && selection) {
            this.selectionPile.reset();
            const drop = new Drop();
            const move = drop.drop(
                selection,
                input.mouse.position,
                true,
                this.foundationPiles,
                this.tableauPiles,
                this.stockPile,
                this.wastePile
            );
            if (move) {
                move.execute();
            }
        }
    }
}
