import { createPileMesh } from "../../mesh";
import * as THREE from "three";
import { PileType } from "./pileType";
import { Card } from "../card";
import { vec3 } from "../../vector";
import { isMouseOverBox } from "../../mesh/collision";
import { SelectionPile } from "./selectionPile";

export abstract class Pile {
    private readonly mesh: THREE.Mesh;
    private readonly cards: Card[] = [];

    public readonly index: number;
    public readonly type: PileType;
    public readonly width: number;
    public readonly height: number;

    constructor(index: number, type: PileType, width: number, height: number, position: THREE.Vector3) {
        this.index = index;
        this.type = type;
        this.width = width;
        this.height = height;
        const material = new THREE.MeshStandardMaterial({ color: 0x00aa00 });

        this.mesh = createPileMesh(this.width, this.height, material);
        this.mesh.position.copy(position);
        this.mesh.geometry.computeBoundingBox();
    }

    public getGlobalPosition(): THREE.Vector3 {
        let position = new THREE.Vector3();
        this.mesh.getWorldPosition(position);
        return position;
    }

    public getTopCardGlobalPosition(): THREE.Vector3 {
        const topCard = this.getTopCard();
        if (topCard) {
            return topCard.getGlobalPosition();
        }
        return this.getGlobalPosition();
    }

    public setPosition(position: THREE.Vector3): void {
        this.mesh.position.copy(position);
        this.mesh.geometry.computeBoundingBox();
    }

    public isEmpty(): boolean {
        return this.cards.length === 0;
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.mesh);
    }

    public removeFromScene(scene: THREE.Scene): void {
        scene.remove(this.mesh);
    }

    public isMouseOver(mousePosition: THREE.Vector2): boolean {
        const box = new THREE.Box3().setFromObject(this.mesh);
        return isMouseOverBox(mousePosition, box);
    }

    public addCard(card: Card, offsetMultiplier: THREE.Vector2): void {
        const topCard = this.getTopCard();
        if (topCard) {
            const p = vec3(this.width * offsetMultiplier.x, this.height * offsetMultiplier.y, 1);
            card.addToCard(topCard, p);
        } else {
            const p = vec3(0, 0, 1);
            card.addToMesh(this.mesh, p);
        }
        this.cards.push(card);
    }

    public abstract addCards(cards: Card[]): void;

    public getNumberOfCards(): number {
        return this.cards.length;
    }

    public getTopCard(): Card | null {
        if (this.cards.length === 0) {
            return null;
        }
        return this.cards[this.cards.length - 1];
    }

    public getBottomCard(): Card | null {
        if (this.cards.length === 0) {
            return null;
        }
        return this.cards[0];
    }

    protected getFaceUpCards(): Card[] {
        return this.cards.filter((card) => card.isFaceUp);
    }

    public getTopCardOrThrow(): Card {
        const topCard = this.getTopCard();
        if (!topCard) {
            throw new Error("No top card");
        }
        return topCard;
    }

    public getBottomCardOrThrow(): Card {
        const bottomCard = this.getBottomCard();
        if (!bottomCard) {
            throw new Error("No bottom card");
        }
        return bottomCard;
    }

    public canPopCard(): boolean {
        return this.cards.length > 0;
    }

    private popCard(): Card | null {
        const card = this.cards.pop() ?? null;
        if (card) {
            card.removeFromMesh(this.mesh);
        }
        return card;
    }

    public popCardOrThrow(): Card {
        const card = this.popCard();
        if (!card) {
            throw new Error("No card to pop");
        } else if (this.cards.length === 0) {
            card.removeFromMesh(this.mesh);
            return card;
        } else {
            const topCard = this.cards[this.cards.length - 1];
            card.removeFromCard(topCard);
            return card;
        }
    }

    protected popCardsTill(card: Card): Card[] {
        if (!this.cards.includes(card)) {
            throw new Error("Card not found");
        }

        const cards: Card[] = [];
        while (this.getTopCard() !== card) {
            cards.push(this.popCardOrThrow());
        }
        cards.push(this.popCardOrThrow());
        return cards;
    }

    public popAllCards(): Card[] {
        const cards: Card[] = [];
        while (this.canPopCard()) {
            cards.push(this.popCardOrThrow());
        }
        return cards;
    }
}
