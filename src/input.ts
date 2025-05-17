import * as THREE from "three";
import { vec2 } from "./graphics/vector";

export class Mouse {
    public position: vec2 = vec2(0, 0);
    public isDown: boolean = false;
    public wasDown: boolean = false;
}

export class Input {
    public mouse: Mouse = new Mouse();

    reset(): void {
        this.mouse.wasDown = this.mouse.isDown;
    }
}
