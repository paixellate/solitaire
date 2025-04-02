import { Card } from "../cards/card";
import { getRankValue, Rank } from "../cards/rank";
import { Pile } from "./pile";
import { isOppositeColor } from "../cards/suit";
import { vec2, vec3 } from "../../vector";
import { SelectionPile } from "./selectionPile";
import { FoundationPile } from "./foundationPile";

export class TableauPile extends Pile {
    constructor(index: number, width: number, height: number, position: vec3, offsetFaceUp: vec2, offsetFaceDown: vec2) {
        super(index, width, height, position, offsetFaceUp, offsetFaceDown);
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

    private getMouseOverCard(mousePosition: vec2): Card {
        const mouseOverCards = this.getFaceUpCards()
            .filter((card) => card.isMouseOver(mousePosition))
            .sort((a, b) => b.getGlobalPosition().z - a.getGlobalPosition().z);
        return mouseOverCards[0];
    }

    public populateSelection(mousePosition: vec2, selectionPile: SelectionPile): void {
        if (!this.isMouseOver(mousePosition)) {
            return;
        }

        if (!this.isEmpty()) {
            selectionPile.setSourcePile(this);
            const card = this.getMouseOverCard(mousePosition);
            selectionPile.setSelectionCardPosition(mousePosition, card.getGlobalPosition());
            selectionPile.addCardsReversed(this.popCardsTill(card), this.offsetFaceUp);
            selectionPile.setIsSingleCard(selectionPile.getNumberOfCards() === 1);
        } else {
            // do nothing.
        }
    }

    public handleDrop(
        mousePosition: vec2,
        selectionPile: SelectionPile,
        tableauPiles: TableauPile[],
        foundationPiles: FoundationPile[]
    ): void {
        let wasAdded = false;

        for (const tableauPile of tableauPiles) {
            if (tableauPile == this) {
                continue;
            }
            if (tableauPile.isMouseOver(mousePosition)) {
                if (tableauPile.canAddCard(selectionPile.getBottomCardOrThrow())) {
                    tableauPile.addCardsReversed(selectionPile.popAllCards());
                    wasAdded = true;
                }
                break;
            }
        }

        if (selectionPile.isSingleCard()) {
            for (const foundationPile of foundationPiles) {
                if (foundationPile.isMouseOver(mousePosition)) {
                    if (foundationPile.canAddCard(selectionPile.getTopCardOrThrow())) {
                        foundationPile.addCard(selectionPile.popCardOrThrow());
                        wasAdded = true;
                    }
                    break;
                }
            }
        }
        if (wasAdded) {
            if (!this.isEmpty()) {
                this.getTopCardOrThrow().makeFaceUp();
            }
        } else {
            this.addCardsReversed(selectionPile.popAllCards());
        }
    }
}
