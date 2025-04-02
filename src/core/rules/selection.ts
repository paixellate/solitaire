import { vec2, vec3 } from "../../vector";
import { Card } from "../cards/card";
import { Pile } from "../piles/pile";

class SelectionData {
    public readonly mousePosition: vec2;
    public readonly cardPosition: vec3;
    public readonly source: Pile;

    constructor(mousePosition: vec2, cardPosition: vec3, source: Pile) {
        this.mousePosition = mousePosition;
        this.cardPosition = cardPosition;
        this.source = source;
    }
}

export class Selection extends SelectionData {
    public readonly card: Card;

    constructor(card: Card, mousePosition: vec2, cardPosition: vec3, sourcePile: Pile) {
        super(mousePosition, cardPosition, sourcePile);
        this.card = card;
    }
}

export class Selections extends SelectionData {
    public readonly cards: Card[];

    constructor(cards: Card[], mousePosition: vec2, cardPosition: vec3, sourcePile: Pile) {
        super(mousePosition, cardPosition, sourcePile);
        this.cards = cards;
    }

    public getTopCard(): Card {
        return this.cards[this.cards.length - 1];
    }

    public getBottomCard(): Card {
        return this.cards[0];
    }
}
