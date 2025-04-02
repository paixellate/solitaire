import { Pile } from "../piles/pile";
import { TableauPile } from "../piles/tableauPile";
import { WastePile } from "../piles/wastePile";
import { Selections, Selection } from "./selection";

export class Move {
    private readonly selection: Selection | Selections;
    private readonly destination: Pile;
    private isExecuted: boolean = false;

    constructor(selection: Selection | Selections, destination: Pile) {
        this.selection = selection;
        this.destination = destination;
    }

    public execute() {
        if (this.selection instanceof Selection) {
            if (this.destination instanceof WastePile) {
                this.selection.card.makeFaceUp();
            }

            this.destination.addCard(this.selection.card);
        } else {
            this.destination.addCards(this.selection.cards);
        }

        if (this.selection.source instanceof TableauPile) {
            if (!this.selection.source.isEmpty()) {
                this.selection.source.getTopCardOrThrow().makeFaceUp();
            }
        }

        this.isExecuted = true;
    }

    public undo() {
        if (this.selection.source instanceof TableauPile) {
            if (!this.selection.source.isEmpty()) {
                this.selection.source.getTopCardOrThrow().makeFaceDown();
            }
        }

        if (this.selection instanceof Selection) {
            if (this.destination instanceof WastePile) {
                this.selection.card.makeFaceDown();
            }

            this.destination.popCardOrThrow();
            this.selection.source.addCard(this.selection.card);
        } else {
            for (let i = this.selection.cards.length - 1; i >= 0; i--) {
                this.destination.popCardOrThrow();
                this.selection.source.addCard(this.selection.cards[i]);
            }
        }

        this.isExecuted = false;
    }
}
