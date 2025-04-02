import { Card } from "./card";
import { Suit } from "./suit";
import { Rank } from "./rank";
import { vec3 } from "../../vector";

export class Deck {
    private cards: Card[];

    constructor(width: number, height: number) {
        this.cards = [];
        for (const suit of Object.values(Suit)) {
            for (const rank of Object.values(Rank)) {
                this.cards.push(new Card(rank, suit, width, height, vec3(0, 0, 0)));
            }
        }
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
