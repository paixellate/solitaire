import * as THREE from "three";
import { Input } from "./input";
import { Board } from "./core/board";
import { Controls } from "./core/controls";

export class Game {
    private readonly board: Board;
    private readonly controls: Controls;

    constructor(board: Board, controls: Controls) {
        this.board = board;
        this.controls = controls;
    }

    public addToScene(scene: THREE.Scene): void {
        this.board.addToScene(scene);
        this.controls.addToScene(scene);
    }

    public mainLoop(input: Input): void {
        const action = this.controls.update(input);

        this.board.update(input, action);
        input.reset();
    }
}
