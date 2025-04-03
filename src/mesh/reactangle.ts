import * as THREE from "three";
import { vec2, vec3 } from "../vector";
import { Object } from "./object";

export class Rectangle extends Object {
    private readonly meshGroup: THREE.Group;
    private readonly meshFront: THREE.Mesh;
    private readonly meshBack: THREE.Mesh;

    public readonly width: number;
    public readonly height: number;

    constructor(width: number, height: number, materialFront: THREE.Material, materialBack: THREE.Material) {
        super();
        this.width = width;
        this.height = height;

        const planeGeometry = new THREE.PlaneGeometry(width, height);
        materialBack.side = THREE.BackSide;
        materialFront.side = THREE.FrontSide;

        this.meshFront = new THREE.Mesh(planeGeometry, materialFront);
        this.meshBack = new THREE.Mesh(planeGeometry, materialBack);
        this.meshBack.position.z = -0.01;

        this.meshGroup = new THREE.Group();
        this.meshGroup.add(this.meshFront);
        this.meshGroup.add(this.meshBack);

        this.getObject().add(this.meshGroup);
    }

    public setLocalRotationY(rotation: number): void {
        this.meshGroup.rotation.y = rotation;
    }

    public getIsMouseOver(mousePosition: vec2): boolean {
        const position = this.getGlobalPosition();
        const size = vec3(this.width, this.height, 0);
        const box = new THREE.Box3().setFromCenterAndSize(position, size);
        return box.containsPoint(vec3(mousePosition.x, mousePosition.y, (box.min.z + box.max.z) / 2));
    }
}
