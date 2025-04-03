import * as THREE from "three";
import { vec3 } from "../vector";

export class Object {
    private readonly object: THREE.Object3D;

    constructor() {
        this.object = new THREE.Object3D();
    }

    protected add(object: Object): void {
        this.object.add(object.object);
    }

    protected remove(object: Object): void {
        this.object.remove(object.object);
    }

    protected getObject(): THREE.Object3D {
        return this.object;
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.object);
    }

    public removeFromScene(scene: THREE.Scene): void {
        scene.remove(this.object);
    }

    public addToObject(object: Object): void {
        object.add(this);
    }

    public removeFromObject(object: Object): void {
        object.remove(this);
    }

    public setLocalPosition(position: vec3): void {
        this.object.position.copy(position);
    }

    public getGlobalPosition(): vec3 {
        let position = vec3(0, 0, 0);
        this.object.getWorldPosition(position);
        return position;
    }
}
