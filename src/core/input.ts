import * as THREE from "three";

interface Input {
    mouse: {
        position: THREE.Vector2;
        isDown: boolean;
        wasDown: boolean;
    };

    reset(): void;
}

export type { Input };
