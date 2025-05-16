import { vec2 } from "../../vector";
import { Board } from "../board";
import { Pile } from "../piles/pile";
import { WastePile } from "../piles/concrete/wastePile";
import { StockPile } from "../piles/concrete/stockPile";
import { Selections } from "./selection";

export class Move {
    private readonly selection: Selections;
    private readonly destination: Pile;
    private didFlipCard: boolean = false;

    constructor(selection: Selections, destination: Pile) {
        this.selection = selection;
        this.destination = destination;
    }

    public execute(): boolean {
        if (this.destination === this.selection.source) {
            this.destination.addCardsReversed(this.selection.cards);
            return false;
        }

        if (this.selection.isSourceTableauPile()) {
            this.destination.addCardsReversed(this.selection.cards);
            if (!this.selection.source.isEmpty()) {
                const card = this.selection.source.getTopCardOrThrow();
                if (!card.isFaceUp) {
                    card.makeFaceUp();
                    this.didFlipCard = true;
                }
            }
            return true;
        }

        if (this.destination instanceof WastePile) {
            this.selection.cards.forEach((card) => card.makeFaceUp());
        }
        if (this.destination instanceof StockPile) {
            this.selection.cards.forEach((card) => card.makeFaceDown());
        }

        this.destination.addCards(this.selection.cards);
        return true;
    }

    public undo() {
        for (const card of this.selection.cards) {
            this.destination.popCardOrThrow();
        }

        if (this.selection.isSourceTableauPile()) {
            if (!this.selection.source.isEmpty()) {
                const card = this.selection.source.getTopCardOrThrow();
                if (this.didFlipCard) {
                    card.makeFaceDown();
                }
            }
            this.selection.source.addCardsReversed(this.selection.cards);
            return;
        }

        if (this.selection.isSourceWastePile()) {
            this.selection.cards.forEach((card) => card.makeFaceUp());
        }

        if (this.selection.isSourceStockPile()) {
            this.selection.cards.forEach((card) => card.makeFaceDown());
        }

        this.selection.source.addCardsReversed(this.selection.cards);
    }


}
