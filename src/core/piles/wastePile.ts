import { Card } from "../card";
import { Pile } from "./pile";
import { PileType } from "./pileType";
import { vec2, vec3 } from "../../vector";
import { StockPile } from "./stockPile";
import { SelectionPile } from "./selectionPile";
import { TableauPile } from "./tableauPile";
import { FoundationPile } from "./foundationPile";

export class WastePile extends Pile {
    constructor(index: number, width: number, height: number, position: vec3) {
        super(index, PileType.WASTE, width, height, position);
    }

    public addCard(card: Card): void {
        card.makeFaceUp();
        super.addCard(card, vec2(0, 0));
    }

    public addCards(cards: Card[]): void {
        for (const card of cards) {
            this.addCard(card);
        }
    }

    public addCardsReversed(cards: Card[]): void {
        for (let i = cards.length - 1; i >= 0; i--) {
            this.addCard(cards[i]);
        }
    }

    public populateSelection(mousePosition: vec2, selectionPile: SelectionPile): void {
        if (!this.isMouseOver(mousePosition)) {
            return;
        }

        if (!this.isEmpty()) {
            selectionPile.setSourcePile(this);
            selectionPile.setIsSingleCard(true);
            selectionPile.setSelectionCardPosition(mousePosition, this.getTopCardGlobalPosition());
            selectionPile.addCard(this.popCardOrThrow());
        } else {
            // do nothing.
        }
    }

    private handleMultiCardDrop(mousePosition: vec2, selectionPile: SelectionPile, stockPile: StockPile): void {
        if (stockPile.isMouseOver(mousePosition)) {
            stockPile.addCards(selectionPile.popAllCards());
        } else {
            this.addCardsReversed(selectionPile.popAllCards());
        }
        selectionPile.reset();
    }

    public handleDrop(
        mousePosition: vec2,
        selectionPile: SelectionPile,
        stockPile: StockPile,
        tableauPiles: TableauPile[],
        foundationPiles: FoundationPile[]
    ): void {
        if (!selectionPile.isSingleCard()) {
            this.handleMultiCardDrop(mousePosition, selectionPile, stockPile);
            return;
        }

        let wasAdded = false;

        for (const tableauPile of tableauPiles) {
            if (tableauPile.isMouseOver(mousePosition)) {
                if (tableauPile.canAddCard(selectionPile.getTopCardOrThrow())) {
                    tableauPile.addCard(selectionPile.popCardOrThrow());
                    wasAdded = true;
                }
                break;
            }
        }

        for (const foundationPile of foundationPiles) {
            if (foundationPile.isMouseOver(mousePosition)) {
                if (foundationPile.canAddCard(selectionPile.getTopCardOrThrow())) {
                    foundationPile.addCard(selectionPile.popCardOrThrow());
                    wasAdded = true;
                }
                break;
            }
        }

        if (!wasAdded) {
            this.addCard(selectionPile.popCardOrThrow());
        }

        selectionPile.reset();
    }
}
