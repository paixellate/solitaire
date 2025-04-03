import * as THREE from "three";
import { Rectangle } from "../../mesh/reactangle";
import { vec3 } from "../../vector";
import { MaterialCache } from "../../texture/materialCache";
import { Input } from "../input";

export class Button extends Rectangle {
    private material: THREE.Material;
    private materialOver: THREE.Material;
    private materialDown: THREE.Material;

    constructor(text: string, width: number, height: number, position: vec3) {
        const color = new THREE.Color("#666");
        const colorOver = new THREE.Color("#999");
        const colorDown = new THREE.Color("#333");
        const buttonMaterial = MaterialCache.getInstance().getButtonMaterial(text, color, width, height);
        super(width, height, buttonMaterial, buttonMaterial);

        this.material = buttonMaterial;
        this.materialOver = MaterialCache.getInstance().getButtonMaterial(text, colorOver, width, height);
        this.materialDown = MaterialCache.getInstance().getButtonMaterial(text, colorDown, width, height);
        this.setLocalPosition(position);
    }

    public update(input: Input): boolean {
        if (this.getIsMouseOver(input.mouse.position)) {
            if (input.mouse.isDown) {
                this.setFrontMaterials(this.materialDown);
            } else {
                this.setFrontMaterials(this.materialOver);
                if (input.mouse.wasDown) {
                    console.log("Button clicked");
                    return true;
                }
            }
        } else {
            this.setFrontMaterials(this.material);
        }
        return false;
    }
}
