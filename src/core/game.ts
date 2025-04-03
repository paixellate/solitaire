import * as THREE from "three";
import { Input } from "./input";
import { Board } from "./board";
import { SelectionPile } from "./piles/selectionPile";
import { History } from "./history";
import { Selections } from "./rules/selection";
import { Move } from "./rules/move";
import { Button } from "./ui/button";
import { vec3 } from "../vector";
import { MaterialCache } from "../texture/materialCache";
import { Action, Controls } from "./ui/controls";

export class Game {
    private readonly board: Board;
    private readonly history: History;
    private readonly selectionPile: SelectionPile;
    private selection: Selections | null = null;
    private readonly controls: Controls;

    constructor() {
        this.board = new Board();
        this.selectionPile = this.board.createSelectionPile();
        this.history = new History();
        this.controls = new Controls();
    }

    public addToScene(scene: THREE.Scene): void {
        this.board.addToScene(scene);
        this.selectionPile.addToScene(scene);
        this.controls.addToScene(scene);
    }

    public mainLoop(input: Input): void {
        const action = this.controls.update(input);
        if (action === Action.Undo) {
            this.history.undo();
        }

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
            if (move.execute()) {
                this.history.addMove(move);
            }
            this.selection = null;
        }
    }
}
