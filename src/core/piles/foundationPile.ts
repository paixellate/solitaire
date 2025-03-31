import { Card } from "../card";
import { getRankValue, Rank } from "../rank";
import { Pile } from "./pile";
import { PileType } from "./pileType";
import { isOppositeColor } from "../suit";

export class FoundationPile extends Pile {
    constructor(index: number, width: number, height: number, position: { x: number, y: number, z: number }) {
        super(index, PileType.FOUNDATION, width, height, position);
    }

    public canAddCard(card: Card): boolean {
        const topCard = this.getTopCard();
        if (topCard) {
            const isOneRankAbove = getRankValue(card.rank) - getRankValue(topCard.rank) === 1;
            const isSameSuit = (card.suit === topCard.suit);
            return isOneRankAbove && isSameSuit;
        } else {
            return card.rank === Rank.ACE;
        }
    }

    public addCard(card: Card): void {
        super.addCard(card, { x: 0, y: 0 });
    }
}
