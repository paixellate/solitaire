import { vec2 } from "../../vector";
import { Board } from "../board";
import { Pile } from "../piles/pile";
import { TableauPile } from "../piles/board/tableauPile";
import { WastePile } from "../piles/board/wastePile";
import { Selections } from "./selection";

export class Move {
    private readonly selection: Selections;
    private readonly destination: Pile;

    constructor(selection: Selections, destination: Pile) {
        this.selection = selection;
        this.destination = destination;
    }

    public execute() {
        if (this.destination instanceof WastePile) {
            this.selection.cards.forEach((card) => card.makeFaceUp());
        }

        this.destination.addCards(this.selection.cards);

        if (this.selection.source instanceof TableauPile) {
            if (!this.selection.source.isEmpty()) {
                this.selection.source.getTopCardOrThrow().makeFaceUp();
            }
        }
    }

    public static create(selection: Selections, mousePosition: vec2, board: Board): Move {
        const isAuto = selection.source.getIsMouseOver(mousePosition);

        if (selection.isSingleCard()) {
            if (selection.isSourceStockPile() && (isAuto || board.wastePile.getIsMouseOver(mousePosition))) {
                return new Move(selection, board.wastePile);
            }

            if (!selection.isSourceFoundationPile()) {
                for (const foundationPile of board.foundationPiles) {
                    if (foundationPile.canAddCard(selection.cards[0]) && (isAuto || foundationPile.getIsMouseOver(mousePosition))) {
                        return new Move(selection, foundationPile);
                    }
                }
            }
        } else {
            if (selection.isSourceWastePile() && (isAuto || board.stockPile.getIsMouseOver(mousePosition))) {
                return new Move(selection, board.stockPile);
            }
        }

        for (const tableauPile of board.tableauPiles) {
            if (tableauPile === selection.source) {
                continue;
            }

            if (tableauPile.canAddCard(selection.getBottomCard()) && (isAuto || tableauPile.getIsMouseOver(mousePosition))) {
                return new Move(selection, tableauPile);
            }
        }

        return new Move(selection, selection.source);
    }
}
