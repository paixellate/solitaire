import { vec3 } from "../../vector";
import { Rank } from "./rank";
import { Suit } from "./suit";
import { Rectangle } from "../../mesh/reactangle";
import { MaterialCache } from "../../texture/materialCache";

export class Card extends Rectangle {
    public readonly rank: Rank;
    public readonly suit: Suit;
    public isFaceUp: boolean = false;

    constructor(rank: Rank, suit: Suit, width: number, height: number, position: vec3) {
        super(
            width,
            height,
            MaterialCache.getInstance().getCardMaterial(rank, suit, width, height),
            MaterialCache.getInstance().getCardBackMaterial(width, height)
        );
        this.rank = rank;
        this.suit = suit;
        this.setLocalPosition(position);
        this.setLocalRotationY(Math.PI);
    }

    public makeFaceUp(): Card {
        this.isFaceUp = true;
        this.setLocalRotationY(0);
        return this;
    }

    public makeFaceDown(): Card {
        this.isFaceUp = false;
        this.setLocalRotationY(Math.PI);
        return this;
    }
}
