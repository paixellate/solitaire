import { Pile } from "./pile";
import { vec2, vec3 } from "../../graphics/vector";
import * as THREE from "three";

export class StockPile extends Pile {
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
}
