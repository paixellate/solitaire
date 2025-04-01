import { vec3 } from "../vector";
import { createCardMesh } from "../mesh";
import { MaterialManager } from "../texture";
import { Rank, RANKS } from "./rank";
import { Suit, SUITS } from "./suit";
import * as THREE from "three";
import { isMouseOverBox } from "../mesh/collision";

export class Card {
    private readonly group: THREE.Group;
    private readonly positioning: THREE.Object3D;

    constructor(
        public readonly rank: Rank,
        public readonly suit: Suit,
        public readonly width: number,
        public readonly height: number,
        position: THREE.Vector3,
        public isFaceUp: boolean = false
    ) {
        this.positioning = new THREE.Object3D();
        this.positioning.position.copy(position);

        const backMaterial = MaterialManager.getInstance().getCardBackMaterial(this.width, this.height);
        const cardTexture = MaterialManager.getInstance().getMaterial(this.rank, this.suit, this.width, this.height);

        this.group = createCardMesh(this.width, this.height, cardTexture, backMaterial);
        this.group.rotation.y = Math.PI;

        this.positioning.add(this.group);
    }

    public getGlobalPosition(): THREE.Vector3 {
        let position = new THREE.Vector3();
        this.positioning.getWorldPosition(position);
        return position;
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

    public isMouseOver(mousePosition: THREE.Vector2): boolean {
        const box = new THREE.Box3().setFromCenterAndSize(this.getGlobalPosition(), vec3(this.width, this.height, 0));
        return isMouseOverBox(mousePosition, box);
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
    }

    public addToCard(card: Card, positionOffset: THREE.Vector3): void {
        card.positioning.add(this.positioning);
        this.setPosition(positionOffset);
    }

    public removeFromCard(card: Card): void {
        card.positioning.remove(this.positioning);
    }
}
