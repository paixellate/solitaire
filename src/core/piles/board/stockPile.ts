import { Pile } from "../pile";
import { vec2, vec3 } from "../../../vector";
import { Selections } from "../../rules/selection";
import { WastePile } from "./wastePile";
import { BoardPile } from "./boardPile";
import * as THREE from "three";

export class StockPile extends Pile implements BoardPile {
    private wastePile: WastePile;

    constructor(
        index: number,
        planeGeometry: THREE.PlaneGeometry,
        position: vec3,
        offsetFaceUp: vec2,
        offsetFaceDown: vec2,
        materialFront: THREE.Material,
        materialBack: THREE.Material,
        wastePile: WastePile
    ) {
        super(index, planeGeometry, position, offsetFaceUp, offsetFaceDown, materialFront, materialBack);
        this.wastePile = wastePile;
    }

    public popSelectedCards(mousePosition: vec2): Selections | null {
        if (!this.isEmpty()) {
            const cardPosition = this.getTopCardGlobalPosition();
            const card = this.popCardOrThrow();
            return new Selections([card], mousePosition, cardPosition, this);
        } else if (this.isEmpty() && !this.wastePile.isEmpty()) {
            const cardPosition = this.getGlobalPosition();
            const cards = this.wastePile.popAllCards();
            return new Selections(cards, mousePosition, cardPosition, this.wastePile);
        } else {
            return null;
        }
    }
}
