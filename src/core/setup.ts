import { MaterialCache } from "../texture/materialCache";
import { StockPile } from "./piles/concrete/stockPile";
import { TableauPile } from "./piles/concrete/tableauPile";
import { WastePile } from "./piles/concrete/wastePile";
import { SelectionPile } from "./piles/selectionPile";
import * as THREE from "three";
import { vec2, vec3 } from "../vector";
import { FoundationPile } from "./piles/concrete/foundationPile";
import { Deck } from "./cards/deck";
import { Board } from "./board";
import { History } from "./history";
import { Controls } from "./ui/controls";
import { Button } from "./ui/button";
import { createBoardMaterial, createStockPileMaterial, createWastePileMaterial, createTableauPileMaterial, createFoundationPileMaterial, createSelectionPileMaterial } from "../material/materials";

const STACK_OFFSET_FACE_UP = vec2(0, -0.2);
const STACK_OFFSET_FACE_DOWN = vec2(0, -0.04);
const STACK_OFFSET_HIDDEN = vec2(0.001, -0.001);

const CARD_WIDTH = 100;
const CARD_HEIGHT = 140;

const BOARD_WIDTH = 1200;
const BOARD_HEIGHT = 800;
const BOARD_POSITION = vec3(0, 0, -100);

const WASTE_PILE_POSITION = vec3(250, 350, 0);
const STOCK_PILE_POSITION = vec3(400, 350, 0);
const TABLEAU_PILES_POSITION = vec3(-500, 150, 0);
const FOUNDATION_PILES_POSITION = vec3(-500, 350, 0);
const SELECTION_PILE_POSITION = vec3(0, 0, 0);

export function createControls(): Controls {
    return new Controls(new Button("↶", 50, 50, vec3(-600, 0, 0)));
}


export function createBoard(): Board {

    const planeGeometry = new THREE.PlaneGeometry(BOARD_WIDTH, BOARD_HEIGHT);
    const history = new History();
    const material = createBoardMaterial();

    const wastePile = createWastePile(CARD_WIDTH, CARD_HEIGHT, WASTE_PILE_POSITION);
    const stockPile = createStockPile(CARD_WIDTH, CARD_HEIGHT, STOCK_PILE_POSITION, wastePile);
    const tableauPiles = createTableauPiles(CARD_WIDTH, CARD_HEIGHT, TABLEAU_PILES_POSITION, 50);
    const foundationPiles = createFoundationPiles(CARD_WIDTH, CARD_HEIGHT, FOUNDATION_PILES_POSITION, 50);
    const selectionPile = createSelectionPile(CARD_WIDTH, CARD_HEIGHT, SELECTION_PILE_POSITION);
    const board = new Board(
        planeGeometry,
        BOARD_POSITION,
        history,
        material,
        wastePile,
        stockPile,
        tableauPiles,
        foundationPiles,
        selectionPile
    );
    wastePile.addToObject(board);
    stockPile.addToObject(board);
    tableauPiles.forEach((pile) => pile.addToObject(board));
    foundationPiles.forEach((pile) => pile.addToObject(board));
    selectionPile.addToObject(board);
    return board;
}

export function setupBoard(board: Board): void {

    const deck = new Deck(CARD_WIDTH, CARD_HEIGHT);
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < i + 1; j++) {
            board.tableauPiles[i].addCard(deck.popOrThrow());
        }
    }
    board.stockPile.addCardsReversed(deck.popAllCards());
    board.tableauPiles.forEach((pile) => pile.getTopCardOrThrow().makeFaceUp());
}

function createSelectionPile(width: number, height: number, positionOffset: vec3): SelectionPile {
    const material = createSelectionPileMaterial(width, height);
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    return new SelectionPile(0, planeGeometry, positionOffset, STACK_OFFSET_FACE_UP, STACK_OFFSET_HIDDEN, material, material);
}

function createStockPile(width: number, height: number, positionOffset: vec3, wastePile: WastePile): StockPile {
    const materialFront = createStockPileMaterial(width, height);
    const materialBack = materialFront;
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    return new StockPile(
        1,
        planeGeometry,
        vec3(positionOffset.x + CARD_WIDTH / 2, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z),
        STACK_OFFSET_FACE_UP,
        STACK_OFFSET_HIDDEN,
        materialFront,
        materialBack,
        wastePile
    );
}

function createWastePile(width: number, height: number, positionOffset: vec3): WastePile {
    const materialFront = createWastePileMaterial(width, height);
    const materialBack = materialFront;
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    return new WastePile(
        2,
        planeGeometry,
        vec3(positionOffset.x + CARD_WIDTH / 2, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z),
        STACK_OFFSET_HIDDEN,
        STACK_OFFSET_HIDDEN,
        materialFront,
        materialBack
    );
}

function createTableauPiles(width: number, height: number, positionOffset: vec3, spacing: number): TableauPile[] {
    const materialFront = createTableauPileMaterial(width, height);
    const materialBack = materialFront;
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    function create(index: number, position: vec3): TableauPile {
        return new TableauPile(
            index,
            planeGeometry,
            position,
            STACK_OFFSET_FACE_UP,
            STACK_OFFSET_FACE_DOWN,
            materialFront,
            materialBack
        );
    }

    return [
        create(3, vec3(positionOffset.x + (CARD_WIDTH * 1) / 2 + spacing * 0, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z)),
        create(4, vec3(positionOffset.x + (CARD_WIDTH * 3) / 2 + spacing * 1, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z)),
        create(5, vec3(positionOffset.x + (CARD_WIDTH * 5) / 2 + spacing * 2, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z)),
        create(6, vec3(positionOffset.x + (CARD_WIDTH * 7) / 2 + spacing * 3, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z)),
        create(7, vec3(positionOffset.x + (CARD_WIDTH * 9) / 2 + spacing * 4, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z)),
        create(8, vec3(positionOffset.x + (CARD_WIDTH * 11) / 2 + spacing * 5, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z)),
        create(9, vec3(positionOffset.x + (CARD_WIDTH * 13) / 2 + spacing * 6, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z)),
    ];
}

function createFoundationPiles(width: number, height: number, positionOffset: vec3, spacing: number): FoundationPile[] {
    const materialFront = createFoundationPileMaterial(width, height);
    const materialBack = materialFront;
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    function create(index: number, position: vec3): FoundationPile {
        return new FoundationPile(
            index,
            planeGeometry,
            position,
            STACK_OFFSET_HIDDEN,
            STACK_OFFSET_HIDDEN,
            materialFront,
            materialBack
        );
    }

    return [
        create(10, vec3(positionOffset.x + (CARD_WIDTH * 1) / 2 + spacing * 0, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z)),
        create(11, vec3(positionOffset.x + (CARD_WIDTH * 3) / 2 + spacing * 1, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z)),
        create(12, vec3(positionOffset.x + (CARD_WIDTH * 5) / 2 + spacing * 2, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z)),
        create(13, vec3(positionOffset.x + (CARD_WIDTH * 7) / 2 + spacing * 3, positionOffset.y - CARD_HEIGHT / 2, positionOffset.z)),
    ];
}
