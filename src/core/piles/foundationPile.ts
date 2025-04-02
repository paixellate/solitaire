import { vec3 } from "../../vector";
import { vec2 } from "../../vector";
import { Card } from "../cards/card";
import { getRankValue, Rank } from "../cards/rank";
import { Pile } from "./pile";

export class FoundationPile extends Pile {
    constructor(index: number, width: number, height: number, position: vec3, faceUpOffset: vec2, faceDownOffset: vec2) {
        super(index, width, height, position, faceUpOffset, faceDownOffset);
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
}
