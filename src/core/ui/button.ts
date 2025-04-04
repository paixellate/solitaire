import * as THREE from "three";
import { Rectangle } from "../../mesh/reactangle";
import { vec3 } from "../../vector";
import { MaterialCache } from "../../texture/materialCache";
import { Input } from "../../input";

export class Button extends Rectangle {
    private material: THREE.Material;
    private materialOver: THREE.Material;
    private materialDown: THREE.Material;

    constructor(text: string, width: number, height: number, position: vec3) {
        const buttonMaterial = MaterialCache.getInstance().getButtonMaterial(text, "#333", "#fff", width, height);
        super(width, height, buttonMaterial, buttonMaterial);

        this.material = buttonMaterial;
        this.materialOver = MaterialCache.getInstance().getButtonMaterial(text, "#666", "#fff", width, height);
        this.materialDown = MaterialCache.getInstance().getButtonMaterial(text, "#111", "#fff", width, height);
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
