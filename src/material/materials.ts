import * as THREE from "three";
import { MaterialCache } from "../texture/materialCache";

const BOARD_COLOR = "#060";
const PILE_BACKGROUND_COLOR = "#040";
const PILE_SYMBOL_COLOR = "#030";

export function createBoardMaterial() {
    return new THREE.MeshBasicMaterial({ color: BOARD_COLOR });
}

export function createSelectionPileMaterial(width: number, height: number) {
    const material = new THREE.MeshBasicMaterial({ color: BOARD_COLOR });
    material.transparent = true;
    material.opacity = 0.0;
    return material;
}

export function createStockPileMaterial(width: number, height: number) {
    return MaterialCache.getInstance().getPileMaterial(
        "∅",
        PILE_BACKGROUND_COLOR,
        PILE_SYMBOL_COLOR,
        width,
        height
    );
}

export function createWastePileMaterial(width: number, height: number) {
    return MaterialCache.getInstance().getPileMaterial(
        "",
        PILE_BACKGROUND_COLOR,
        PILE_SYMBOL_COLOR,
        width,
        height
    );
}

export function createTableauPileMaterial(width: number, height: number) {
    return MaterialCache.getInstance().getPileMaterial(
        "K",
        PILE_BACKGROUND_COLOR,
        PILE_SYMBOL_COLOR,
        width,
        height
    );
}

export function createFoundationPileMaterial(width: number, height: number) {
    return MaterialCache.getInstance().getPileMaterial(
        "A",
        PILE_BACKGROUND_COLOR,
        PILE_SYMBOL_COLOR,
        width,
        height
    );
}
