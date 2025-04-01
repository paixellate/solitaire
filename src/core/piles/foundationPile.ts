import { vec3 } from "../../vector";
import { vec2 } from "../../vector";
import { Card } from "../card";
import { getRankValue, Rank } from "../rank";
import { Pile } from "./pile";
import { PileType } from "./pileType";

export class FoundationPile extends Pile {
    constructor(index: number, width: number, height: number, position: vec3) {
        super(index, PileType.FOUNDATION, width, height, position);
    }

    private getOffset(): vec2 {
        return vec2(0, 0);
    }

    public canAddCard(card: Card): boolean {
        const topCard = this.getTopCard();
        if (topCard) {
            const isOneRankAbove = getRankValue(card.rank) - getRankValue(topCard.rank) === 1;
            const isSameSuit = card.suit === topCard.suit;
            return isOneRankAbove && isSameSuit;
        } else {
            return card.rank === Rank.ACE;
        }
    }

    public addCard(card: Card, offset: vec2 = vec2(0, 0)): void {
        super.addCard(card, offset);
    }

    public addCards(cards: Card[]): void {
        for (const card of cards) {
            this.addCard(card, this.getOffset());
        }
    }
}
