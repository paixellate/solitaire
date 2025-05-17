import { vec2, vec3 } from "../../graphics/vector";
import { Card } from "../cards/card";
import { Pile } from "../piles/pile";
import { StockPile } from "../piles/stockPile";
import { WastePile } from "../piles/wastePile";
import { FoundationPile } from "../piles/foundationPile";
import { TableauPile } from "../piles/tableauPile";
import * as THREE from "three";

/**
 * A class that represents the selection of cards on the board.
 */
export class Selections {
    public readonly cards: Card[];
    public readonly sourcePile: Pile;
    public readonly sourcePileBounds: THREE.Box3;
    public readonly sourceMousePosition: vec2;
    public readonly selectedCardPosition: vec3;

    constructor(cards: Card[], mousePosition: vec2, cardPosition: vec3, sourcePile: Pile, sourceBounds: THREE.Box3) {
        this.cards = cards;
        this.sourcePile = sourcePile;
        this.sourcePileBounds = new THREE.Box3().copy(sourceBounds);
        this.sourceMousePosition = vec2(mousePosition.x, mousePosition.y);
        this.selectedCardPosition = vec3(cardPosition.x, cardPosition.y, cardPosition.z);
    }

    public getTopCard(): Card {
        return this.cards[this.cards.length - 1];
    }

    public getBottomCard(): Card {
        return this.cards[0];
    }

    public isSingleCard(): boolean {
        return this.cards.length === 1;
    }

    public isSourceWastePile(): boolean {
        return this.sourcePile instanceof WastePile;
    }

    public isSourceStockPile(): boolean {
        return this.sourcePile instanceof StockPile;
    }

    public isSourceFoundationPile(): boolean {
        return this.sourcePile instanceof FoundationPile;
    }

    public isSourceTableauPile(): boolean {
        return this.sourcePile instanceof TableauPile;
    }

    public isMouseOverSource(mousePosition: vec2): boolean {
        return this.sourcePileBounds.containsPoint(vec3(mousePosition.x, mousePosition.y, 0));
    }
}
