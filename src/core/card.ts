import { vec3 } from "../vector";
import { createCardMesh } from "../mesh";
import { MaterialManager } from "../texture";
import { Rank, RANKS } from "./rank";
import { Suit, SUITS } from "./suit";
import * as THREE from "three";

export class Card {
    private readonly group: THREE.Group;
    private readonly positioning: THREE.Object3D;

    constructor(
        public readonly rank: Rank,
        public readonly suit: Suit,
        public readonly width: number,
        public readonly height: number,
        public position: { x: number; y: number; z: number },
        public isFaceUp: boolean = false
    ) {
        this.positioning = new THREE.Object3D();
        this.positioning.position.set(this.position.x, this.position.y, this.position.z);

        const backMaterial = MaterialManager.getInstance().getCardBackMaterial(this.width, this.height);
        const cardTexture = MaterialManager.getInstance().getMaterial(this.rank, this.suit, this.width, this.height);

        this.group = createCardMesh(this.width, this.height, cardTexture, backMaterial);
        this.group.rotation.y = Math.PI;

        this.positioning.add(this.group);
    }

    private getPosition(): THREE.Vector3 {
        return this.positioning.position.clone();
    }

    private setPosition(position: THREE.Vector3): void {
        this.positioning.position.copy(position);
    }

    private setRotation(yRotation: number): void {
        this.group.rotation.y = yRotation;
    }

    public makeFaceUp(): void {
        this.isFaceUp = true;
        this.setRotation(0);
    }

    public makeFaceDown(): void {
        this.isFaceUp = false;
        this.setRotation(Math.PI);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.positioning);
    }

    public removeFromScene(scene: THREE.Scene): void {
        scene.remove(this.positioning);
    }

    public addToMesh(mesh: THREE.Mesh, positionOffset: THREE.Vector3): void {
        mesh.add(this.positioning);
        this.setPosition(positionOffset);
    }

    public removeFromMesh(mesh: THREE.Mesh): void {
        mesh.remove(this.positioning);
        this.setPosition(vec3(this.position.x, this.position.y, this.position.z));
    }

    public addToCard(card: Card, positionOffset: THREE.Vector3): void {
        card.positioning.add(this.positioning);
        this.setPosition(positionOffset);
    }

    public removeFromCard(card: Card): void {
        card.positioning.remove(this.positioning);
        this.setPosition(vec3(this.position.x, this.position.y, this.position.z));
    }
}
