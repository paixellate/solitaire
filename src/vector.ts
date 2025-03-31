import * as THREE from "three";


export type vec2 = THREE.Vector2;
export type vec3 = THREE.Vector3;

export function vec2(x: number, y: number): vec2 {
    return new THREE.Vector2(x, y);
}

export function vec3(x: number, y: number, z: number): vec3 {
    return new THREE.Vector3(x, y, z);
}
