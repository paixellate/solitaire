import { Input } from "./input";
import { Board } from "./board";
import { TableauPile } from "./piles/tableauPile";
import * as THREE from "three";
import { SelectionPile } from "./piles/selectionPile";
import { StockPile } from "./piles/stockPile";
import { WastePile } from "./piles/wastePile";
import { vec3 } from "../vector";
import { FoundationPile } from "./piles/foundationPile";

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
        this.board.dealCards(this.stockPile, this.tableauPiles);
    }

    public addToScene(scene: THREE.Scene): void {
        this.stockPile.addToScene(scene);
        this.wastePile.addToScene(scene);
        this.tableauPiles.forEach((pile) => pile.addToScene(scene));
        this.foundationPiles.forEach((pile) => pile.addToScene(scene));
        this.selectionPile.addToScene(scene);
    }

    public mainLoop(input: Input): void {

        if (input.mouse.isDown) {
            if (!input.mouse.wasDown && this.selectionPile.isEmpty()) {
                this.stockPile.populateSelection(input.mouse.position, this.selectionPile, this.wastePile);
                this.wastePile.populateSelection(input.mouse.position, this.selectionPile);
                this.tableauPiles.forEach((pile) => pile.populateSelection(input.mouse.position, this.selectionPile));
                this.selectionPile.validateAfterSelection();
            } else {
                this.selectionPile.moveWithCursor(input.mouse.position);
            }
        } else if (input.mouse.wasDown && !this.selectionPile.isEmpty()) {
            const sourcePile = this.selectionPile.getSourcePileOrThrow();
            if (sourcePile instanceof StockPile) {
                sourcePile.handleDrop(input.mouse.position, this.selectionPile, this.wastePile);
            } else if (sourcePile instanceof WastePile) {
                sourcePile.handleDrop(
                    input.mouse.position,
                    this.selectionPile,
                    this.stockPile,
                    this.tableauPiles,
                    this.foundationPiles
                );
            } else if (sourcePile instanceof TableauPile) {
                sourcePile.handleDrop(input.mouse.position, this.selectionPile, this.tableauPiles, this.foundationPiles);
            }

            this.selectionPile.validateAfterDrop();
            this.selectionPile.reset();
        }
        else {
            this.selectionPile.setPosition(vec3(0, 0, -10000));
        }
    }
}
