import { Card } from "../card";
import { getRankValue, Rank } from "../rank";
import { Pile } from "./pile";
import { PileType } from "./pileType";
import { isOppositeColor } from "../suit";

export class TableauPile extends Pile {
    constructor(index: number, width: number, height: number, position: { x: number; y: number; z: number }) {
        super(index, PileType.TABLEAU, width, height, position);
    }

    public canAddCard(card: Card): boolean {
        const topCard = this.getTopCard();
        if (topCard) {
            const isOneLess = getRankValue(topCard.rank) - getRankValue(card.rank) === 1;
            const isValidColor = isOppositeColor(topCard.suit, card.suit);
            return isOneLess && isValidColor;
        } else {
            return card.rank === Rank.KING;
        }
    }

    public addCard(card: Card): void {
        super.addCard(card, { x: 0, y: -0.2 });
    }
}
