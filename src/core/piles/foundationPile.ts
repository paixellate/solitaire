import { vec3 } from "../../graphics/vector";
import { vec2 } from "../../graphics/vector";
import { Card } from "../cards/card";
import { getRankValue, Rank } from "../cards/rank";
import { Pile } from "./pile";
import * as THREE from "three";

export class FoundationPile extends Pile {
    constructor(
        index: number,
        planeGeometry: THREE.PlaneGeometry,
        position: vec3,
        faceUpOffset: vec2,
        faceDownOffset: vec2,
        materialFront: THREE.Material,
        materialBack: THREE.Material
    ) {
        super(index, planeGeometry, position, faceUpOffset, faceDownOffset, materialFront, materialBack);
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
