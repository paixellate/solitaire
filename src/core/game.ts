import * as THREE from "three";
import { Input } from "../input";
import { Board } from "./board";
import { Controls } from "./ui/controls";
import { setupBoard } from "./setup";

export class Game {
    private readonly board: Board;
    private readonly controls: Controls;

    constructor(board: Board, controls: Controls) {
        this.board = board;
        this.controls = controls;
        setupBoard(this.board);
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
