import { vec2, vec3 } from "../../vector";
import { Board } from "../board";
import { Card } from "../cards/card";
import { Pile } from "../piles/pile";

export class Selections {
    public readonly cards: Card[];
    public readonly mousePosition: vec2;
    public readonly cardPosition: vec3;
    public readonly source: Pile;

    constructor(cards: Card[], mousePosition: vec2, cardPosition: vec3, sourcePile: Pile) {
        this.cards = cards;
        this.mousePosition = mousePosition;
        this.cardPosition = cardPosition;
        this.source = sourcePile;
    }

    public getTopCard(): Card {
        return this.cards[this.cards.length - 1];
    }

    public getBottomCard(): Card {
        return this.cards[0];
    }

    public isSingleCard(): boolean {
        return this.cards.length === 1;
    }

    public static create(mousePosition: vec2, board: Board): Selections | null {
        for (const sourcePile of [board.wastePile, ...board.foundationPiles]) {
            if (sourcePile.isMouseOver(mousePosition)) {
                return sourcePile.popSelectedCards(mousePosition);
            }
        }

        for (const tableauPile of board.tableauPiles) {
            if (tableauPile.isMouseOver(mousePosition)) {
                return tableauPile.popSelectedCards(mousePosition);
            }
        }

        if (board.stockPile.isMouseOver(mousePosition)) {
            return board.stockPile.popSelectedCards(mousePosition);
        }

        return null;
    }
}
