import { Card } from "./card";
import { Suit } from "./suit";
import { Rank } from "./rank";
import { vec3 } from "../../vector";
import { MaterialCache } from "../../texture/materialCache";
import * as THREE from "three";

export class Deck {
    private cards: Card[];

    constructor(width: number, height: number, cards?: Card[]) {
        this.cards = cards || this.createCards(width, height);
    }

    private createCards(width: number, height: number): Card[] {
        const cards: Card[] = [];
        for (const suit of Object.values(Suit)) {
            for (const rank of Object.values(Rank)) {
                const materialFront = MaterialCache.getInstance().getCardMaterial(rank, suit, width, height);
                const materialBack = MaterialCache.getInstance().getCardBackMaterial(width, height);
                const planeGeometry = new THREE.PlaneGeometry(width, height);
                cards.push(new Card(rank, suit, planeGeometry, vec3(0, 0, 0), materialFront, materialBack));
            }
        }
        return cards;
    }

    public popOrThrow(): Card {
        if (this.cards.length === 0) {
            throw new Error("Deck is empty");
        }
        return this.cards.pop()!;
    }

    public popAllCards(): Card[] {
        const cards: Card[] = [];
        while (this.cards.length > 0) {
            cards.push(this.popOrThrow());
        }
        return cards;
    }
}
