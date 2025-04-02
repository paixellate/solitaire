import { vec3 } from "../../vector";
import { createCardMesh } from "../../mesh";
import { MaterialManager } from "../../texture";
import { Rank } from "./rank";
import { Suit } from "./suit";
import * as THREE from "three";
import { isMouseOverBox } from "../../mesh/collision";

export class Card {
    private readonly name: string;
    private readonly group: THREE.Group;
    private readonly positioning: THREE.Object3D;
    public readonly rank: Rank;
    public readonly suit: Suit;
    public readonly width: number;
    public readonly height: number;
    public isFaceUp: boolean = false;

    constructor(rank: Rank, suit: Suit, width: number, height: number, position: vec3) {
        this.rank = rank;
        this.suit = suit;
        this.width = width;
        this.height = height;
        this.name = `${rank} of ${suit}`;

        this.positioning = new THREE.Object3D();
        this.positioning.position.copy(position);

        const backMaterial = MaterialManager.getInstance().getCardBackMaterial(this.width, this.height);
        const cardTexture = MaterialManager.getInstance().getMaterial(this.rank, this.suit, this.width, this.height);

        this.group = createCardMesh(this.width, this.height, cardTexture, backMaterial);
        this.group.rotation.y = Math.PI;

        this.positioning.add(this.group);
    }

    private setPosition(position: vec3): void {
        this.positioning.position.copy(position);
    }

    private setRotation(yRotation: number): void {
        this.group.rotation.y = yRotation;
    }

    public getGlobalPosition(): vec3 {
        let position = new THREE.Vector3();
        this.positioning.getWorldPosition(position);
        return position;
    }

    public isMouseOver(mousePosition: THREE.Vector2): boolean {
        const box = new THREE.Box3().setFromCenterAndSize(this.getGlobalPosition(), vec3(this.width, this.height, 0));
        return isMouseOverBox(mousePosition, box);
    }

    public makeFaceUp(): Card {
        this.isFaceUp = true;
        this.setRotation(0);
        return this;
    }

    public makeFaceDown(): Card {
        this.isFaceUp = false;
        this.setRotation(Math.PI);
        return this;
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.positioning);
    }

    public removeFromScene(scene: THREE.Scene): void {
        scene.remove(this.positioning);
    }

    public addToMesh(mesh: THREE.Mesh, positionOffset: vec3): void {
        mesh.add(this.positioning);
        this.setPosition(positionOffset);
    }

    public removeFromMesh(mesh: THREE.Mesh): void {
        mesh.remove(this.positioning);
    }

    public addToCard(card: Card, positionOffset: vec3): void {
        card.positioning.add(this.positioning);
        this.setPosition(positionOffset);
    }

    public removeFromCard(card: Card): void {
        card.positioning.remove(this.positioning);
    }
}
