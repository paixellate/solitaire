import { Card } from "../../cards/card";
import { getRankValue, Rank } from "../../cards/rank";
import { Pile } from "../pile";
import { isOppositeColor } from "../../cards/suit";
import { vec2, vec3 } from "../../../vector";
import { Selections } from "../../rules/selection";
import { InteractivePile } from "../interactivePile";
import * as THREE from "three";

export class TableauPile extends Pile implements InteractivePile {
    constructor(
        index: number,
        planeGeometry: THREE.PlaneGeometry,
        position: vec3,
        offsetFaceUp: vec2,
        offsetFaceDown: vec2,
        materialFront: THREE.Material,
        materialBack: THREE.Material
    ) {
        super(index, planeGeometry, position, offsetFaceUp, offsetFaceDown, materialFront, materialBack);
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

    private getMouseOverCard(mousePosition: vec2): Card | null {
        const mouseOverCards = this.getFaceUpCards()
            .filter((card) => card.getIsMouseOver(mousePosition))
            .sort((a, b) => b.getGlobalPosition().z - a.getGlobalPosition().z);

        if (mouseOverCards.length > 0) {
            return mouseOverCards[0];
        }
        return null;
    }

    public popSelectedCards(mousePosition: vec2): Selections | null {
        const card = this.getMouseOverCard(mousePosition);
        if (card) {
            const cardPosition = card.getGlobalPosition();
            const cards = this.popCardsTill(card);
            return new Selections(cards, mousePosition, cardPosition, this);
        }
        return null;
    }
}
