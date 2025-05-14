import { MaterialCache } from "../texture/materialCache";
import { StockPile } from "./piles/board/stockPile";
import { TableauPile } from "./piles/board/tableauPile";
import { WastePile } from "./piles/board/wastePile";
import { SelectionPile } from "./piles/selectionPile";
import * as THREE from "three";
import { vec2, vec3 } from "../vector";
import { FoundationPile } from "./piles/board/foundationPile";
import { Deck } from "./cards/deck";
import { Board } from "./board";
import { History } from "./history";
import { Controls } from "./ui/controls";
import { Button } from "./ui/button";

const STACK_OFFSET_FACE_UP = vec2(0, -0.2);
const STACK_OFFSET_FACE_DOWN = vec2(0, -0.04);
const STACK_OFFSET_HIDDEN = vec2(0.001, -0.001);

const BOARD_COLOR = "#060";
const PILE_BACKGROUND_COLOR = "#040";
const PILE_SYMBOL_COLOR = "#030";

const BOARD_WIDTH = 1200;
const BOARD_HEIGHT = 800;

const CARD_WIDTH = 100;
const CARD_HEIGHT = 140;

export function createControls(): Controls {
    return new Controls(new Button("↶", 50, 50, vec3(-600, 0, 0)));
}

export function createBoard(): Board {
    const material = new THREE.MeshBasicMaterial({ color: BOARD_COLOR });

    const wastePile = createWastePile(vec3(250, 350, 0));
    const stockPile = createStockPile(vec3(400, 350, 0), wastePile);
    const tableauPiles = createTableauPiles(vec3(-500, 150, 0), 50);
    const foundationPiles = createFoundationPiles(vec3(-500, 350, 0), 50);
    const selectionPile = createSelectionPile();
    const history = new History();
    const planeGeometry = new THREE.PlaneGeometry(BOARD_WIDTH, BOARD_HEIGHT);
    return new Board(
        planeGeometry,
        vec3(0, 0, -100),
        history,
        material,
        wastePile,
        stockPile,
        tableauPiles,
        foundationPiles,
        selectionPile
    );
}

export function setupBoard(board: Board): void {
    board.wastePile.addToObject(board);
    board.stockPile.addToObject(board);
    board.tableauPiles.forEach((pile) => pile.addToObject(board));
    board.foundationPiles.forEach((pile) => pile.addToObject(board));
    board.selectionPile.addToObject(board);
}

export function createSelectionPile(): SelectionPile {
    const material = new THREE.MeshBasicMaterial({ color: BOARD_COLOR });
    material.transparent = true;
    material.opacity = 0.0;
    const planeGeometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT);
    return new SelectionPile(0, planeGeometry, vec3(0, 0, 0), STACK_OFFSET_FACE_UP, STACK_OFFSET_HIDDEN, material, material);
}

export function createStockPile(positionOffset: vec3, wastePile: WastePile): StockPile {
    const materialFront = MaterialCache.getInstance().getPileMaterial(
        "∅",
        PILE_BACKGROUND_COLOR,
        PILE_SYMBOL_COLOR,
        CARD_WIDTH,
        CARD_HEIGHT
    );
    const materialBack = MaterialCache.getInstance().getPileMaterial(
        "∅",
        PILE_BACKGROUND_COLOR,
        PILE_SYMBOL_COLOR,
        CARD_WIDTH,
        CARD_HEIGHT
    );
    const planeGeometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT);
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

export function createWastePile(positionOffset: vec3): WastePile {
    const materialFront = MaterialCache.getInstance().getPileMaterial(
        "",
        PILE_BACKGROUND_COLOR,
        PILE_SYMBOL_COLOR,
        CARD_WIDTH,
        CARD_HEIGHT
    );
    const materialBack = MaterialCache.getInstance().getPileMaterial("", PILE_BACKGROUND_COLOR, PILE_SYMBOL_COLOR, CARD_WIDTH, CARD_HEIGHT);
    const planeGeometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT);
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

export function createTableauPiles(positionOffset: vec3, spacing: number): TableauPile[] {
    const materialFront = MaterialCache.getInstance().getPileMaterial(
        "K",
        PILE_BACKGROUND_COLOR,
        PILE_SYMBOL_COLOR,
        CARD_WIDTH,
        CARD_HEIGHT
    );
    const materialBack = MaterialCache.getInstance().getPileMaterial(
        "K",
        PILE_BACKGROUND_COLOR,
        PILE_SYMBOL_COLOR,
        CARD_WIDTH,
        CARD_HEIGHT
    );
    const planeGeometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT);
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

export function createFoundationPiles(positionOffset: vec3, spacing: number): FoundationPile[] {
    const materialFront = MaterialCache.getInstance().getPileMaterial(
        "A",
        PILE_BACKGROUND_COLOR,
        PILE_SYMBOL_COLOR,
        CARD_WIDTH,
        CARD_HEIGHT
    );
    const materialBack = MaterialCache.getInstance().getPileMaterial(
        "A",
        PILE_BACKGROUND_COLOR,
        PILE_SYMBOL_COLOR,
        CARD_WIDTH,
        CARD_HEIGHT
    );
    const planeGeometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT);
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

export function createDeck(): Deck {
    return new Deck(CARD_WIDTH, CARD_HEIGHT);
}

export function dealCards(deck: Deck, stockPile: StockPile, tableauPiles: TableauPile[]): void {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < i + 1; j++) {
            tableauPiles[i].addCard(deck.popOrThrow());
        }
    }
    stockPile.addCardsReversed(deck.popAllCards());
    tableauPiles.forEach((pile) => pile.getTopCardOrThrow().makeFaceUp());
}
