import * as THREE from "three";
import { Rectangle } from "../../graphics/mesh/reactangle";
import { vec3 } from "../../graphics/vector";
import { Input } from "../../input";
import { createButtonMaterial, createButtonMaterialOver, createButtonMaterialDown } from "../../graphics/material/materials";

export class Button extends Rectangle {
    private material: THREE.Material;
    private materialOver: THREE.Material;
    private materialDown: THREE.Material;

    constructor(text: string, width: number, height: number, position: vec3) {
        const buttonMaterial = createButtonMaterial(text, width, height);
        const plane = new THREE.PlaneGeometry(width, height);
        super(plane, buttonMaterial, buttonMaterial);

        this.material = buttonMaterial;
        this.materialOver = createButtonMaterialOver(text, width, height);
        this.materialDown = createButtonMaterialDown(text, width, height);
        this.setLocalPosition(position);
    }

    public update(input: Input): boolean {
        if (this.getIsMouseOver(input.mouse.position)) {
            if (input.mouse.isDown) {
                this.setFrontMaterials(this.materialDown);
            } else {
                this.setFrontMaterials(this.materialOver);
                if (input.mouse.wasDown) {
                    return true;
                }
            }
        } else {
            this.setFrontMaterials(this.material);
        }
        return false;
    }
}
