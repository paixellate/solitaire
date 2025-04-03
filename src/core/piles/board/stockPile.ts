import { Pile } from "../pile";
import { vec2, vec3 } from "../../../vector";
import { Selections } from "../../rules/selection";
import { WastePile } from "./wastePile";
import { BoardPile } from "./boardPile";

export class StockPile extends Pile implements BoardPile {
    private wastePile: WastePile;

    constructor(
        index: number,
        width: number,
        height: number,
        position: vec3,
        offsetFaceUp: vec2,
        offsetFaceDown: vec2,
        wastePile: WastePile
    ) {
        super(index, width, height, position, offsetFaceUp, offsetFaceDown);
        this.wastePile = wastePile;
    }

    public popSelectedCards(mousePosition: vec2): Selections | null {
        if (!this.isEmpty()) {
            const cardPosition = this.getTopCardGlobalPosition();
            const card = this.popCardOrThrow();
            return new Selections([card], mousePosition, cardPosition, this);
        } else if (this.isEmpty() && !this.wastePile.isEmpty()) {
            const cardPosition = this.getGlobalPosition();
            const cards = this.wastePile.popAllCards();
            return new Selections(cards, mousePosition, cardPosition, this.wastePile);
        } else {
            return null;
        }
    }
}
