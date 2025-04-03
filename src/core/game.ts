import * as THREE from "three";
import { Input } from "./input";
import { Board } from "./board";
import { SelectionPile } from "./piles/selectionPile";
import { History } from "./history";
import { Selections } from "./rules/selection";
import { Move } from "./rules/move";

export class Game {
    private readonly board: Board;
    private readonly history: History;
    private readonly selectionPile: SelectionPile;
    private selection: Selections | null = null;

    constructor() {
        this.board = new Board();
        this.selectionPile = this.board.createSelectionPile();
        this.history = new History();
    }

    public addToScene(scene: THREE.Scene): void {
        this.board.addToScene(scene);
        this.selectionPile.addToScene(scene);
    }

    public mainLoop(input: Input): void {
        if (input.mouse.isDown) {
            if (!input.mouse.wasDown && !this.selection) {
                this.selection = Selections.create(input.mouse.position, this.board);
                this.selectionPile.setSelection(this.selection);
            } else if (this.selection) {
                this.selectionPile.moveWithCursor(input.mouse.position);
            }
        } else if (input.mouse.wasDown && this.selection) {
            this.selectionPile.reset();
            const move = Move.create(this.selection, input.mouse.position, this.board);
            move.execute();
            this.history.addMove(move);
            this.selection = null;
        }
    }
}
