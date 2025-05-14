import { vec3 } from "../../vector";
import { Rank } from "./rank";
import { Suit } from "./suit";
import { Rectangle } from "../../mesh/reactangle";
import * as THREE from "three";

export class Card extends Rectangle {
    public readonly rank: Rank;
    public readonly suit: Suit;
    public isFaceUp: boolean = false;

    constructor(
        rank: Rank,
        suit: Suit,
        planeGeometry: THREE.PlaneGeometry,
        position: vec3,
        materialFront: THREE.Material,
        materialBack: THREE.Material
    ) {
        super(planeGeometry, materialFront, materialBack);
        this.rank = rank;
        this.suit = suit;
        this.setLocalPosition(position);
        this.setLocalRotationY(Math.PI);
    }

    public toString(): string {
        return `${this.rank} of ${this.suit}`;
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
