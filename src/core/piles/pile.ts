import { createPileMesh } from "../../mesh/pile";
import * as THREE from 'three';
import { PileType } from "./pileType";
import { Card } from "../card";
import { Vector3 } from "three";
import { vec3 } from "../../vector";
import { TEXT_OFFSET_MULTIPLIER } from "../../texture/card";

export class Pile {
    private readonly mesh: THREE.Mesh;
    private readonly cards: Card[] = [];

    constructor(
        public readonly index: number,
        public readonly type: PileType,
        public readonly width: number,
        public readonly height: number,
        public readonly position: { x: number, y: number, z: number }
    ) {
        const material = new THREE.MeshStandardMaterial({ color: 0x00aa00 });

        this.mesh = createPileMesh(this.width, this.height, material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.mesh);
    }

    public removeFromScene(scene: THREE.Scene): void {
        scene.remove(this.mesh);
    }

    public addCard(card: Card, offsetMultiplier: { x: number, y: number }): void {
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

    public getTopCard(): Card | null {
        if (this.cards.length === 0) {
            return null;
        }
        return this.cards[this.cards.length - 1];
    }

    public canPopCard(): boolean {
        return this.cards.length > 0;
    }

    public popCard(): Card | null {
        return this.cards.pop() ?? null;
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
}
