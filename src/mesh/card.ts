import * as THREE from "three";

export function createCardMesh (
    width: number,
    height: number,
    frontMaterial: THREE.Material,
    backMaterial: THREE.Material) {

    // Create a rectangular plane with different materials for front and back
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    backMaterial.side = THREE.BackSide;

    // Create two meshes, one for each side
    const frontMesh = new THREE.Mesh(planeGeometry, frontMaterial);
    const backMesh = new THREE.Mesh(planeGeometry, backMaterial);
    backMesh.position.z = -0.01; // Slightly offset to prevent z-fighting

    // Add the meshes to a group
    const planeGroup = new THREE.Group();
    planeGroup.add(frontMesh);
    planeGroup.add(backMesh);

    return planeGroup;
}