import { vec3 } from "../../vector";
import { MaterialManager } from "../../texture";
import { Rank } from "./rank";
import { Suit } from "./suit";
import { Rectangle } from "../../mesh/reactangle";

export class Card extends Rectangle {
    private readonly name: string;
    public readonly rank: Rank;
    public readonly suit: Suit;
    public isFaceUp: boolean = false;

    constructor(rank: Rank, suit: Suit, width: number, height: number, position: vec3) {
        super(
            width,
            height,
            MaterialManager.getInstance().getMaterial(rank, suit, width, height),
            MaterialManager.getInstance().getCardBackMaterial(width, height)
        );
        this.rank = rank;
        this.suit = suit;
        this.name = `${rank} of ${suit}`;
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
