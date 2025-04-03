import * as THREE from "three";
import { Card } from "../cards/card";
import { vec2, vec3 } from "../../vector";
import { Rectangle } from "../../mesh/reactangle";

export abstract class Pile extends Rectangle {
    private readonly name: string = this.constructor.name;
    private readonly cards: Card[] = [];

    public readonly index: number;
    public readonly offsetFaceUp: vec2;
    public readonly offsetFaceDown: vec2;

    constructor(
        index: number,
        width: number,
        height: number,
        position: vec3,
        faceUpOffset: vec2,
        faceDownOffset: vec2,
        materialFront: THREE.Material,
        materialBack: THREE.Material
    ) {
        super(width, height, materialFront, materialBack);
        this.index = index;
        this.offsetFaceUp = faceUpOffset;
        this.offsetFaceDown = faceDownOffset;
        this.setLocalPosition(position);
    }

    public getTopCardGlobalPosition(): vec3 {
        const topCard = this.getTopCard();
        if (topCard) {
            return topCard.getGlobalPosition();
        }
        return this.getGlobalPosition();
    }

    protected getTopCard(): Card | null {
        if (this.cards.length === 0) {
            return null;
        }
        return this.cards[this.cards.length - 1];
    }

    protected getBottomCard(): Card | null {
        if (this.cards.length === 0) {
            return null;
        }
        return this.cards[0];
    }

    protected getFaceUpCards(): Card[] {
        return this.cards.filter((card) => card.isFaceUp);
    }

    public isEmpty(): boolean {
        return this.cards.length === 0;
    }

    public getNumberOfCards(): number {
        return this.cards.length;
    }

    public addCard(card: Card, faceUpOffset: vec2 = this.offsetFaceUp, faceDownOffset: vec2 = this.offsetFaceDown): void {
        const topCard = this.getTopCard();
        if (topCard) {
            if (topCard.isFaceUp) {
                const position = vec3(this.width * faceUpOffset.x, this.height * faceUpOffset.y, 1);
                card.setLocalPosition(position);
                card.addToObject(topCard);
            } else {
                const position = vec3(this.width * faceDownOffset.x, this.height * faceDownOffset.y, 1);
                card.setLocalPosition(position);
                card.addToObject(topCard);
            }
        } else {
            const position = vec3(0, 0, 1);
            card.setLocalPosition(position);
            card.addToObject(this);
        }
        this.cards.push(card);
    }

    public addCards(cards: Card[], faceUpOffset: vec2 = this.offsetFaceUp, faceDownOffset: vec2 = this.offsetFaceDown): void {
        for (const card of cards) {
            this.addCard(card, faceUpOffset, faceDownOffset);
        }
    }

    public addCardsReversed(cards: Card[], faceUpOffset: vec2 = this.offsetFaceUp, faceDownOffset: vec2 = this.offsetFaceDown): void {
        for (let i = cards.length - 1; i >= 0; i--) {
            this.addCard(cards[i], faceUpOffset, faceDownOffset);
        }
    }

    public getTopCardOrThrow(): Card {
        const topCard = this.getTopCard();
        if (!topCard) {
            throw new Error("No top card");
        }
        return topCard;
    }

    public getBottomCardOrThrow(): Card {
        const bottomCard = this.getBottomCard();
        if (!bottomCard) {
            throw new Error("No bottom card");
        }
        return bottomCard;
    }

    public popCard(): Card | null {
        const card = this.cards.pop() ?? null;
        if (!card) {
            return null;
        }

        if (this.cards.length === 0) {
            card.removeFromObject(this);
            return card;
        } else {
            const topCard = this.cards[this.cards.length - 1];
            card.removeFromObject(topCard);
            return card;
        }
    }

    public popCardOrThrow(): Card {
        const card = this.popCard();
        if (!card) {
            throw new Error("No card to pop");
        }
        return card;
    }

    public popCardsTill(card: Card): Card[] {
        if (!this.cards.includes(card)) {
            throw new Error("Card not found");
        }

        const cards: Card[] = [];
        while (this.getTopCard() !== card) {
            cards.push(this.popCardOrThrow());
        }
        cards.push(this.popCardOrThrow());
        return cards;
    }

    public popAllCards(): Card[] {
        const cards: Card[] = [];
        while (!this.isEmpty()) {
            cards.push(this.popCardOrThrow());
        }
        return cards;
    }
}
