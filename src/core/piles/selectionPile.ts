import { Card } from "../card";
import { Pile } from "./pile";
import { PileType } from "./pileType";
import { vec2, vec3 } from "../../vector";
import * as THREE from "three";

export class SelectionPile extends Pile {
    private sourcePile: Pile | null;
    private isASingleCard: boolean;
    private initialMousePosition: THREE.Vector2 | null = null;
    private cardOffset: THREE.Vector2 | null = null;

    constructor(index: number, width: number, height: number, position: vec3) {
        super(index, PileType.SELECTION, width, height, position);
        this.sourcePile = null;
        this.isASingleCard = false;
    }

    public addCard(card: Card, offset: vec2 = vec2(0, -0.2)): void {
        super.addCard(card, offset);
    }

    public addCards(cards: Card[], offset: vec2 = vec2(0, -0.2)): void {
        for (const card of cards) {
            this.addCard(card, offset);
        }
    }

    public addCardsReversed(cards: Card[], offset: vec2 = vec2(0, -0.2)): void {
        for (let i = cards.length - 1; i >= 0; i--) {
            this.addCard(cards[i], offset);
        }
    }

    public setSelectionCardPosition(mousePosition: vec2, position: vec3): void {
        // Store initial mouse position for movement tracking
        this.initialMousePosition = mousePosition.clone();

        // Calculate offset between mouse and card position
        this.cardOffset = vec2(position.x - mousePosition.x, position.y - mousePosition.y);

        // Set initial card position
        this.setPosition(vec3(position.x, position.y, 100));
    }

    public moveWithCursor(mousePosition: vec2): void {
        // Only move the card if we have initial positions
        if (this.initialMousePosition && this.cardOffset) {
            // Move card to cursor position plus the initial offset
            this.setPosition(vec3(mousePosition.x + this.cardOffset.x, mousePosition.y + this.cardOffset.y, 100));
        }
    }

    public setSourcePile(sourcePile: Pile): void {
        this.sourcePile = sourcePile;
    }

    public getSourcePileOrThrow(): Pile {
        if (this.sourcePile === null) {
            throw new Error("Selection pile has no source pile");
        }
        return this.sourcePile;
    }

    public isSingleCard(): boolean {
        return this.isASingleCard;
    }

    public setIsSingleCard(isSingleCard: boolean): void {
        this.isASingleCard = isSingleCard;
    }

    public validateAfterSelection(): void {
        if (this.isASingleCard && this.getNumberOfCards() > 1) {
            throw new Error("Selection pile is supposed to be a single card after selection");
        }
        if (!this.isEmpty() && this.sourcePile === null) {
            throw new Error("Selection pile has no source pile after selection");
        }
    }

    public validateAfterDrop(): void {
        if (!this.isEmpty()) {
            throw new Error("Selection pile is not empty after drop");
        }
    }

    public reset(): void {
        this.sourcePile = null;
        this.isASingleCard = false;
        this.initialMousePosition = null;
        this.cardOffset = null;
    }
}
