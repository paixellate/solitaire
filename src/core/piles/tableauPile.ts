import { Card } from "../card";
import { getRankValue, Rank } from "../rank";
import { Pile } from "./pile";
import { PileType } from "./pileType";
import { isOppositeColor } from "../suit";
import { vec2, vec3 } from "../../vector";
import { SelectionPile } from "./selectionPile";
import { FoundationPile } from "./foundationPile";

export class TableauPile extends Pile {
    constructor(index: number, width: number, height: number, position: vec3) {
        super(index, PileType.TABLEAU, width, height, position);
    }

    private getOffset(): vec2 {
        return vec2(0, -0.2);
    }

    private getSetupOffset(): vec2 {
        return vec2(0, -0.04);
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
        const topCard = this.getTopCard();
        if (topCard && topCard.isFaceUp) {
            super.addCard(card, this.getOffset());
        } else {
            super.addCard(card, this.getSetupOffset());
        }
    }

    public addCardForSetup(card: Card): void {
        super.addCard(card, this.getSetupOffset());
    }

    public addCards(cards: Card[]): void {
        for (const card of cards) {
            this.addCard(card);
        }
    }

    private getMouseOverCard(mousePosition: vec2): Card {
        const mouseOverCards = this.getFaceUpCards()
            .filter((card) => card.isMouseOver(mousePosition))
            .sort((a, b) => b.getGlobalPosition().z - a.getGlobalPosition().z);
        return mouseOverCards[0];
    }
    private popSelectedCards(mousePosition: vec2): Card[] {
        const mouseOverCard = this.getMouseOverCard(mousePosition);
        return this.popCardsTill(mouseOverCard);
    }

    public populateSelection(mousePosition: vec2, selectionPile: SelectionPile): void {
        if (!this.isMouseOver(mousePosition)) {
            return;
        }

        if (!this.isEmpty()) {
            selectionPile.setSourcePile(this);
            const card = this.getMouseOverCard(mousePosition);
            selectionPile.setSelectionCardPosition(mousePosition, card.getGlobalPosition());
            const selectedCards = this.popCardsTill(card).reverse();
            if (selectedCards.length > 1) {
                selectionPile.setIsSingleCard(false);
            } else {
                selectionPile.setIsSingleCard(true);
            }
            selectionPile.addCards(selectedCards, this.getOffset());
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
                    tableauPile.addCards(selectionPile.popAllCards().reverse());
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
            this.getTopCardOrThrow().makeFaceUp();
        } else {
            this.addCards(selectionPile.popAllCards().reverse());
        }
        selectionPile.reset();
    }
}
