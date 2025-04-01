import { Card } from "../card";
import { Rank } from "../rank";
import { Pile } from "./pile";
import { PileType } from "./pileType";
import { Suit } from "../suit";
import { vec2, vec3 } from "../../vector";
import { WastePile } from "./wastePile";
import { SelectionPile } from "./selectionPile";

export class StockPile extends Pile {
    constructor(index: number, width: number, height: number, position: vec3) {
        super(index, PileType.STOCK, width, height, position);
        this.addDeckToStock();
    }

    private addDeckToStock(): void {
        for (const suit of Object.values(Suit)) {
            for (const rank of Object.values(Rank)) {
                this.addCard(new Card(rank, suit, 100, 140, vec3(0, 0, 0)));
            }
        }
    }

    private getCardOffset(): vec2 {
        return vec2(0.001, -0.001);
    }

    public dealCardForSetup(): Card {
        return this.popCardOrThrow();
    }

    public addCard(card: Card): void {
        card.makeFaceDown();
        super.addCard(card, this.getCardOffset());
    }

    public addCards(cards: Card[]): void {
        for (const card of cards) {
            this.addCard(card);
        }
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
            const cards = wastePile.popAllCards();
            cards.forEach((card) => card.makeFaceDown());
            selectionPile.addCardsReversed(cards, this.getCardOffset());
        } else {
            // do nothing. Both piles are empty
        }
    }

    public handleDrop(mousePosition: vec2, selectionPile: SelectionPile, wastePile: WastePile): void {
        if (selectionPile.isSingleCard() && (this.isMouseOver(mousePosition) || wastePile.isMouseOver(mousePosition))) {
            wastePile.addCard(selectionPile.popCardOrThrow());
        } else {
            this.addCards(selectionPile.popAllCards());
        }
        selectionPile.reset();
    }
}
