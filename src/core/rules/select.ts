import { vec2 } from "../../vector";
import { FoundationPile } from "../piles/foundationPile";
import { StockPile } from "../piles/stockPile";
import { TableauPile } from "../piles/tableauPile";
import { WastePile } from "../piles/wastePile";
import { Selection, Selections } from "./selection";

export class Select {
    public select(
        mousePosition: vec2,
        wastePile: WastePile,
        stockPile: StockPile,
        tableauPiles: TableauPile[],
        foundationPiles: FoundationPile[]
    ): Selection | Selections | null {
        for (const sourcePile of [wastePile, ...foundationPiles]) {
            if (sourcePile.isMouseOver(mousePosition)) {
                if (!sourcePile.isEmpty()) {
                    return new Selection(sourcePile.popCardOrThrow(), mousePosition, sourcePile.getTopCardGlobalPosition(), sourcePile);
                }
                return null;
            }
        }

        for (const tableauPile of tableauPiles) {
            if (tableauPile.isMouseOver(mousePosition)) {
                const card = tableauPile.getMouseOverCard(mousePosition);
                if (card) {
                    const cardPosition = card.getGlobalPosition();
                    const cards = tableauPile.popCardsTill(card);
                    if (cards.length > 1) {
                        return new Selections(cards.reverse(), mousePosition, cardPosition, tableauPile);
                    }
                    return new Selection(cards[0], mousePosition, cardPosition, tableauPile);
                }
                return null;
            }
        }

        if (stockPile.isMouseOver(mousePosition)) {
            if (!stockPile.isEmpty()) {
                return new Selection(stockPile.popCardOrThrow(), mousePosition, stockPile.getTopCardGlobalPosition(), stockPile);
            }
            if (stockPile.isEmpty() && !wastePile.isEmpty()) {
                const cardPosition = wastePile.getTopCardGlobalPosition();
                const cards = wastePile.popAllCards().map((card) => card.makeFaceDown());
                return new Selections(cards, mousePosition, cardPosition, wastePile);
            }
            return null;
        }

        return null;
    }
}
