import * as THREE from "three";
import { vec3 } from "../vector";

export class GameObject {
    private readonly gameObject: THREE.Object3D;

    constructor() {
        this.gameObject = new THREE.Object3D();
    }

    protected add(gameObject: GameObject): void {
        this.gameObject.add(gameObject.gameObject);
    }

    protected remove(gameObject: GameObject): void {
        this.gameObject.remove(gameObject.gameObject);
    }

    protected getObject(): THREE.Object3D {
        return this.gameObject;
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.gameObject);
    }

    public removeFromScene(scene: THREE.Scene): void {
        scene.remove(this.gameObject);
    }

    public addToObject(gameObject: GameObject): void {
        gameObject.add(this);
    }

    public removeFromObject(gameObject: GameObject): void {
        gameObject.remove(this);
    }

    public setLocalPosition(position: vec3): void {
        this.gameObject.position.copy(position);
    }

    public getGlobalPosition(): vec3 {
        let position = vec3(0, 0, 0);
        this.gameObject.getWorldPosition(position);
        return position;
    }
}
