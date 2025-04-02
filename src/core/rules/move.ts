import { vec2 } from "../../vector";
import { Board } from "../board";
import { FoundationPile } from "../piles/foundationPile";
import { Pile } from "../piles/pile";
import { StockPile } from "../piles/stockPile";
import { TableauPile } from "../piles/tableauPile";
import { WastePile } from "../piles/wastePile";
import { Selections } from "./selection";

export class Move {
    private readonly selection: Selections;
    private readonly destination: Pile;
    private isExecuted: boolean = false;

    constructor(selection: Selections, destination: Pile) {
        this.selection = selection;
        this.destination = destination;
    }

    public execute() {
        console.log("executing move");
        console.log(this.selection.cards);
        console.log(this.selection.source);
        console.log(this.destination);

        if (this.destination instanceof WastePile) {
            this.selection.cards.forEach((card) => card.makeFaceUp());
        }

        this.destination.addCards(this.selection.cards);

        if (this.selection.source instanceof TableauPile) {
            if (!this.selection.source.isEmpty()) {
                this.selection.source.getTopCardOrThrow().makeFaceUp();
            }
        }

        this.isExecuted = true;
    }

    public static create(selection: Selections, mousePosition: vec2, board: Board): Move {
        const isAuto = selection.source.isMouseOver(mousePosition);

        if (selection.isSingleCard()) {
            if (selection.source instanceof StockPile && (isAuto || board.wastePile.isMouseOver(mousePosition))) {
                return new Move(selection, board.wastePile);
            }

            if (!(selection.source instanceof FoundationPile)) {
                for (const foundationPile of board.foundationPiles) {
                    if (foundationPile.canAddCard(selection.cards[0]) && (isAuto || foundationPile.isMouseOver(mousePosition))) {
                        return new Move(selection, foundationPile);
                    }
                }
            }
        } else {
            if (selection.source instanceof WastePile && (isAuto || board.stockPile.isMouseOver(mousePosition))) {
                return new Move(selection, board.stockPile);
            }
        }

        for (const tableauPile of board.tableauPiles) {
            if (tableauPile === selection.source) {
                continue;
            }

            if (tableauPile.canAddCard(selection.getBottomCard()) && (isAuto || tableauPile.isMouseOver(mousePosition))) {
                return new Move(selection, tableauPile);
            }
        }

        return new Move(selection, selection.source);
    }
}
