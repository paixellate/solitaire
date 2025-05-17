import * as THREE from "three";
import { vec2, vec3 } from "../vector";
import { GameObject } from "./gameObject";

export class Rectangle extends GameObject {
    private readonly meshGroup: THREE.Group;
    private readonly meshFront: THREE.Mesh;
    private readonly meshBack: THREE.Mesh;
    private readonly planeGeometry: THREE.PlaneGeometry;

    constructor(plane: THREE.PlaneGeometry, materialFront: THREE.Material, materialBack: THREE.Material) {
        super();
        this.planeGeometry = plane;

        materialBack.side = THREE.BackSide;
        materialFront.side = THREE.FrontSide;

        this.meshFront = new THREE.Mesh(this.planeGeometry, materialFront);
        this.meshBack = new THREE.Mesh(this.planeGeometry, materialBack);
        this.meshBack.position.z = -0.01;

        this.meshGroup = new THREE.Group();
        this.meshGroup.add(this.meshFront);
        this.meshGroup.add(this.meshBack);

        this.getObject().add(this.meshGroup);
    }

    public setLocalRotationY(rotation: number): void {
        this.meshGroup.rotation.y = rotation;
    }

    private getLocalIsMouseOver(mousePosition: vec2): boolean {
        const position = this.getGlobalPosition();
        this.planeGeometry.computeBoundingBox();
        const box = this.planeGeometry.boundingBox!;
        return box.containsPoint(vec3(mousePosition.x - position.x, mousePosition.y - position.y, 0));
    }

    public getIsMouseOver(mousePosition: vec2): boolean {
        const objectBox = new THREE.Box3().setFromObject(this.getObject());
        const isGlobalOver = objectBox.containsPoint(vec3(mousePosition.x, mousePosition.y, 0));
        const isLocalOver = this.getLocalIsMouseOver(mousePosition);
        const isMouseOverResult = isGlobalOver || isLocalOver;
        return isMouseOverResult;
    }

    public getBounds(): THREE.Box3 {
        return new THREE.Box3().setFromObject(this.getObject());
    }

    public setFrontMaterials(material: THREE.Material): void {
        this.meshFront.material = material;
    }

    public setBackMaterials(materials: THREE.Material[]): void {
        this.meshBack.material = materials;
    }
}
