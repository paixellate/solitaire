import { vec2, vec3 } from "../../vector";
import { Board } from "../board";
import { Card } from "../cards/card";
import { Pile } from "../piles/pile";
import { StockPile } from "../piles/board/stockPile";
import { WastePile } from "../piles/board/wastePile";
import { FoundationPile } from "../piles/board/foundationPile";
import { TableauPile } from "../piles/board/tableauPile";

export class Selections {
    public readonly cards: Card[];
    public readonly source: Pile;
    public readonly mousePosition: vec2;
    public readonly cardPosition: vec3;

    constructor(cards: Card[], mousePosition: vec2, cardPosition: vec3, sourcePile: Pile) {
        this.cards = cards;
        this.source = sourcePile;
        this.mousePosition = mousePosition;
        this.cardPosition = cardPosition;
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

    public isSourceWastePile(): boolean {
        return this.source instanceof WastePile;
    }

    public isSourceStockPile(): boolean {
        return this.source instanceof StockPile;
    }

    public isSourceFoundationPile(): boolean {
        return this.source instanceof FoundationPile;
    }

    public isSourceTableauPile(): boolean {
        return this.source instanceof TableauPile;
    }

    public static create(mousePosition: vec2, board: Board): Selections | null {
        for (const sourcePile of [board.wastePile, ...board.foundationPiles]) {
            if (sourcePile.getIsMouseOver(mousePosition)) {
                return sourcePile.popSelectedCards(mousePosition);
            }
        }

        for (const tableauPile of board.tableauPiles) {
            if (tableauPile.getIsMouseOver(mousePosition)) {
                return tableauPile.popSelectedCards(mousePosition);
            }
        }

        if (board.stockPile.getIsMouseOver(mousePosition)) {
            return board.stockPile.popSelectedCards(mousePosition);
        }

        return null;
    }
}
