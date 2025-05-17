import { Selections } from "../selection/selection";
import { Pile } from "../piles/pile";
import { WastePile } from "../piles/wastePile";
import { StockPile } from "../piles/stockPile";

export class Move {
    private readonly selection: Selections;
    private readonly destination: Pile;
    private didFlipCard: boolean = false;

    constructor(selection: Selections, destination: Pile) {
        this.selection = selection;
        this.destination = destination;
    }

    public execute(): boolean {
        if (this.destination === this.selection.sourcePile) {
            this.destination.addCardsReversed(this.selection.cards);
            return false;
        }

        if (this.selection.isSourceTableauPile()) {
            this.destination.addCardsReversed(this.selection.cards);
            if (!this.selection.sourcePile.isEmpty()) {
                const card = this.selection.sourcePile.getTopCardOrThrow();
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
            if (!this.selection.sourcePile.isEmpty()) {
                const card = this.selection.sourcePile.getTopCardOrThrow();
                if (this.didFlipCard) {
                    card.makeFaceDown();
                }
            }
            this.selection.sourcePile.addCardsReversed(this.selection.cards);
            return;
        }

        if (this.selection.isSourceWastePile()) {
            this.selection.cards.forEach((card) => card.makeFaceUp());
        }

        if (this.selection.isSourceStockPile()) {
            this.selection.cards.forEach((card) => card.makeFaceDown());
        }

        this.selection.sourcePile.addCardsReversed(this.selection.cards);
    }
}
