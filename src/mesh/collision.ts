import * as THREE from "three";
import { vec3 } from "../vector";

export function isMouseOverBox(mousePosition: { x: number; y: number }, box: THREE.Box3): boolean {
    const localMousePosition = vec3(
        mousePosition.x,
        mousePosition.y,
        (box.min.z + box.max.z) / 2
    );

    return box.containsPoint(localMousePosition);
}
