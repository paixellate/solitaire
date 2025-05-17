import { Pile } from "../piles/pile";
import { vec2, vec3 } from "../../graphics/vector";
import { Selections } from "./selection";
import * as THREE from "three";

/**
 * A special pile class that is used to hold and display the selected cards.
 * 
 * When a card is added to the selection pile, it is removed from any other pile is was selected from.
 */
export class SelectionPile extends Pile {
    private initialMousePosition: vec2 | null = null;
    private mousePositionOffset: vec2 | null = null;

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

    public setSelectionCardPosition(mousePosition: vec2, position: vec3): void {
        this.initialMousePosition = mousePosition.clone();
        this.mousePositionOffset = vec2(position.x - mousePosition.x, position.y - mousePosition.y);
        this.setLocalPosition(vec3(position.x, position.y, 100));
    }

    public moveWithCursor(mousePosition: vec2): void {
        if (this.initialMousePosition && this.mousePositionOffset) {
            this.setLocalPosition(vec3(mousePosition.x + this.mousePositionOffset.x, mousePosition.y + this.mousePositionOffset.y, 100));
        }
    }

    public set(selection: Selections | null): void {
        if (selection) {
            if (selection.isSourceTableauPile()) {
                this.addCards(selection.cards.slice().reverse(), this.offsetFaceUp, this.offsetFaceUp);
            } else if (selection.isSourceWastePile()) {
                this.addCards(selection.cards.slice().reverse(), this.offsetFaceDown, this.offsetFaceDown);
            } else {
                this.addCards(selection.cards);
            }
            this.setSelectionCardPosition(selection.sourceMousePosition, selection.selectedCardPosition);
        }
    }

    public reset(): void {
        this.popAllCards();
        this.initialMousePosition = null;
        this.mousePositionOffset = null;
        this.setLocalPosition(vec3(0, 0, -10000));
    }
}
