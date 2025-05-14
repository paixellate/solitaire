import { Pile } from "../pile";
import { vec2, vec3 } from "../../../vector";
import { Selections } from "../../rules/selection";
import { BoardPile } from "./boardPile";
import * as THREE from "three";

export class WastePile extends Pile implements BoardPile {
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
        if (!this.isEmpty()) {
            const cardPosition = this.getTopCardGlobalPosition();
            const card = this.popCardOrThrow();
            return new Selections([card], mousePosition, cardPosition, this);
        }
        return null;
    }
}
