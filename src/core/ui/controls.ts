import * as THREE from "three";
import { vec3 } from "../../vector";
import { Button } from "./button";
import { Input } from "../input";

export class Controls {
    private readonly undo: Button;

    constructor() {
        this.undo = new Button("↶", 50, 50, vec3(-600, 0, 0));
    }

    public addToScene(scene: THREE.Scene): void {
        this.undo.addToScene(scene);
    }

    public update(input: Input): void {
        this.undo.update(input);
    }
}
