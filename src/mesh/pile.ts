import * as THREE from "three";

export function createPileMesh(width: number, height: number, frontMaterial: THREE.Material): THREE.Mesh {
    return new THREE.Mesh(new THREE.PlaneGeometry(width, height), frontMaterial);
}
