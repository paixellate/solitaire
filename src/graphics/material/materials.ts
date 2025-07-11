import * as THREE from "three";
import { MaterialCache } from "../texture/materialCache";
import { Rank } from "../../core/cards/rank";
import { Suit } from "../../core/cards/suit";

const BOARD_COLOR = "#363";
const PILE_BACKGROUND_COLOR = "#343";
const PILE_SYMBOL_COLOR = "#232";
export const SCENE_BACKGROUND_COLOR = 0x223322;
export const AMBIENT_LIGHT_COLOR = 0xffffff;
export const AMBIENT_LIGHT_INTENSITY = 2.5;

const BUTTON_COLOR = "#333";
const BUTTON_COLOR_OVER = "#666";
const BUTTON_COLOR_DOWN = "#111";
const BUTTON_TEXT_COLOR = "#fff";

export function createButtonMaterial(text: string, width: number, height: number) {
    return MaterialCache.getInstance().getButtonMaterial(text, BUTTON_COLOR, BUTTON_TEXT_COLOR, width, height);
}

export function createButtonMaterialOver(text: string, width: number, height: number) {
    return MaterialCache.getInstance().getButtonMaterial(text, BUTTON_COLOR_OVER, BUTTON_TEXT_COLOR, width, height);
}

export function createButtonMaterialDown(text: string, width: number, height: number) {
    return MaterialCache.getInstance().getButtonMaterial(text, BUTTON_COLOR_DOWN, BUTTON_TEXT_COLOR, width, height);
}

export function createBoardMaterial() {
    return new THREE.MeshBasicMaterial({ color: BOARD_COLOR });
}

export function createCardMaterial(rank: Rank, suit: Suit, width: number, height: number) {
    return MaterialCache.getInstance().getCardMaterial(rank, suit, width, height);
}

export function createCardBackMaterial(width: number, height: number) {
    return MaterialCache.getInstance().getCardBackMaterial(width, height);
}

export function createSelectionPileMaterial() {
    const material = new THREE.MeshBasicMaterial({ color: BOARD_COLOR });
    material.transparent = true;
    material.opacity = 0.0;
    return material;
}

export function createStockPileMaterial(width: number, height: number) {
    return MaterialCache.getInstance().getPileMaterial("∅", PILE_BACKGROUND_COLOR, PILE_SYMBOL_COLOR, width, height);
}

export function createWastePileMaterial(width: number, height: number) {
    return MaterialCache.getInstance().getPileMaterial("", PILE_BACKGROUND_COLOR, PILE_SYMBOL_COLOR, width, height);
}

export function createTableauPileMaterial(width: number, height: number) {
    return MaterialCache.getInstance().getPileMaterial("K", PILE_BACKGROUND_COLOR, PILE_SYMBOL_COLOR, width, height);
}

export function createFoundationPileMaterial(width: number, height: number) {
    return MaterialCache.getInstance().getPileMaterial("A", PILE_BACKGROUND_COLOR, PILE_SYMBOL_COLOR, width, height);
}
