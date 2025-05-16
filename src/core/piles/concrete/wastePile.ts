import { Pile } from "../pile";
import { vec2, vec3 } from "../../../vector";
import { Selections } from "../../rules/selection";
import { InteractivePile } from "../interactivePile";
import * as THREE from "three";

export class WastePile extends Pile implements InteractivePile {
    constructor(
        index: number,
        planeGeometry: THREE.PlaneGeometry,
        position: vec3,
        offsetFaceUp: vec2,
        offsetFaceDown: vec2,
        materialFront: THREE.Material,
        materialBack: THREE.Material
    ) {
        super(index, planeGeometry, position, offsetFaceUp, offsetFaceDown, materialFront, materialBack);
    }

    public popSelectedCards(mousePosition: vec2): Selections | null {
        if (!this.isEmpty() && this.getIsMouseOver(mousePosition)) {
            const cardPosition = this.getTopCardGlobalPosition();
            const card = this.popCardOrThrow();
            return new Selections([card], mousePosition, cardPosition, this);
        }
        return null;
    }
}
