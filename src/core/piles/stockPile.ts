import { Pile } from "./pile";
import { vec2, vec3 } from "../../vector";
import { WastePile } from "./wastePile";
import { SelectionPile } from "./selectionPile";

export class StockPile extends Pile {
    constructor(index: number, width: number, height: number, position: vec3, offsetFaceUp: vec2, offsetFaceDown: vec2) {
        super(index, width, height, position, offsetFaceUp, offsetFaceDown);
    }

    public populateSelection(mousePosition: vec2, selectionPile: SelectionPile, wastePile: WastePile): void {
        if (!this.isMouseOver(mousePosition)) {
            return;
        }

        if (!this.isEmpty()) {
            selectionPile.setSourcePile(this);
            selectionPile.setIsSingleCard(true);
            selectionPile.setSelectionCardPosition(mousePosition, this.getTopCardGlobalPosition());
            selectionPile.addCard(this.popCardOrThrow());
        } else if (this.isEmpty() && !wastePile.isEmpty()) {
            selectionPile.setSourcePile(wastePile);
            selectionPile.setIsSingleCard(false);
            selectionPile.setSelectionCardPosition(mousePosition, this.getGlobalPosition());
            const cards = wastePile.popAllCards().map((card) => card.makeFaceDown());
            selectionPile.addCardsReversed(cards, this.offsetFaceUp, this.offsetFaceDown);
        } else {
            // do nothing. Both piles are empty
        }
    }

    public handleDrop(mousePosition: vec2, selectionPile: SelectionPile, wastePile: WastePile): void {
        if (selectionPile.isSingleCard() && (this.isMouseOver(mousePosition) || wastePile.isMouseOver(mousePosition))) {
            wastePile.addCard(selectionPile.popCardOrThrow().makeFaceUp());
        } else {
            this.addCards(selectionPile.popAllCards().map((card) => card.makeFaceDown()));
        }
    }
}
