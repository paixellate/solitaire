import * as THREE from "three";
import { Button } from "./button";
import { Input } from "../../input";

export enum Action {
    None,
    Undo,
    Restart,
    NewGame,
}

export class Controls {
    private readonly undo: Button;
    private readonly restart: Button;
    private readonly newGame: Button;

    constructor(undoButton: Button, restartButton: Button, newGameButton: Button) {
        this.undo = undoButton;
        this.restart = restartButton;
        this.newGame = newGameButton;
    }

    public addToScene(scene: THREE.Scene): void {
        this.undo.addToScene(scene);
        this.restart.addToScene(scene);
        this.newGame.addToScene(scene);
    }

    public update(input: Input): Action {
        if (this.undo.update(input)) {
            return Action.Undo;
        } else if (this.restart.update(input)) {
            return Action.Restart;
        } else if (this.newGame.update(input)) {
            return Action.NewGame;
        } else {
            return Action.None;
        }
    }
}
