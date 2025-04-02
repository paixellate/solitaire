import { vec2 } from "../../vector";
import { FoundationPile } from "../piles/foundationPile";
import { StockPile } from "../piles/stockPile";
import { TableauPile } from "../piles/tableauPile";
import { WastePile } from "../piles/wastePile";
import { Move } from "./move";
import { Selection, Selections } from "./selection";

export class Drop {
    public drop(
        selection: Selection | Selections,
        mousePosition: vec2,
        isAuto: boolean,
        foundationPiles: FoundationPile[],
        tableauPiles: TableauPile[],
        stockPile: StockPile,
        wastePile: WastePile
    ): Move | null {
        if (selection instanceof Selection) {
            if (selection.source instanceof StockPile && (isAuto || wastePile.isMouseOver(mousePosition))) {
                return new Move(selection, wastePile);
            }

            if (!(selection.source instanceof FoundationPile)) {
                for (const foundationPile of foundationPiles) {
                    if (foundationPile.canAddCard(selection.card) && (isAuto || foundationPile.isMouseOver(mousePosition))) {
                        return new Move(selection, foundationPile);
                    }
                }
            }

            for (const tableauPile of tableauPiles) {
                if (tableauPile.canAddCard(selection.card) && (isAuto || tableauPile.isMouseOver(mousePosition))) {
                    return new Move(selection, tableauPile);
                }
            }

            selection.source.addCard(selection.card);
            return null;
        } else {
            const selections = selection;

            if (selections.source instanceof WastePile && (isAuto || stockPile.isMouseOver(mousePosition))) {
                return new Move(selections, stockPile);
            }

            for (const tableauPile of tableauPiles) {
                if (tableauPile === selections.source) {
                    continue;
                }

                if (tableauPile.canAddCard(selections.getBottomCard()) && (isAuto || tableauPile.isMouseOver(mousePosition))) {
                    return new Move(selections, tableauPile);
                }
            }

            selections.source.addCards(selections.cards);
            return null;
        }
    }
}
