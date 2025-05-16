import { MaterialCache } from "../texture/materialCache";
import { StockPile } from "./piles/concrete/stockPile";
import { TableauPile } from "./piles/concrete/tableauPile";
import { WastePile } from "./piles/concrete/wastePile";
import { SelectionPile } from "./piles/selectionPile";
import * as THREE from "three";
import { vec3 } from "../vector";
import { FoundationPile } from "./piles/concrete/foundationPile";
import { Deck } from "./cards/deck";
import { Board } from "./board";
import { History } from "./history";
import { Controls } from "./ui/controls";
import { Button } from "./ui/button";
import { createBoardMaterial, createStockPileMaterial, createWastePileMaterial, createTableauPileMaterial, createFoundationPileMaterial, createSelectionPileMaterial } from "../material/materials";
import { LayoutConfig } from "./layout";

export function createControls(): Controls {
    return new Controls(new Button("↶", 50, 50, vec3(0, -200, 0)));
}

export function createBoard(layout: LayoutConfig): Board {
    const planeGeometry = new THREE.PlaneGeometry(layout.boardWidth, layout.boardHeight);
    const history = new History();
    const material = createBoardMaterial();

    const wastePile = createWastePile(layout);
    const stockPile = createStockPile(layout, wastePile);
    const tableauPiles = createTableauPiles(layout);
    const foundationPiles = createFoundationPiles(layout);
    const selectionPile = createSelectionPile(layout);
    const board = new Board(
        planeGeometry,
        layout.boardPosition,
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

    setupBoard(board, layout);
    return board;
}

function setupBoard(board: Board, layout: LayoutConfig): void {
    const deck = new Deck(layout.cardWidth, layout.cardHeight);
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < i + 1; j++) {
            board.tableauPiles[i].addCard(deck.popOrThrow());
        }
    }
    board.stockPile.addCardsReversed(deck.popAllCards());
    board.tableauPiles.forEach((pile) => pile.getTopCardOrThrow().makeFaceUp());
}

function createSelectionPile(layout: LayoutConfig): SelectionPile {
    const material = createSelectionPileMaterial();
    const planeGeometry = new THREE.PlaneGeometry(layout.cardWidth, layout.cardHeight);
    return new SelectionPile(
        0, 
        planeGeometry, 
        layout.selectionPilePosition, 
        layout.stackOffsetFaceUp, 
        layout.stackOffsetHidden, 
        material, 
        material
    );
}

function createStockPile(layout: LayoutConfig, wastePile: WastePile): StockPile {
    const materialFront = createStockPileMaterial(layout.cardWidth, layout.cardHeight);
    const materialBack = materialFront;
    const planeGeometry = new THREE.PlaneGeometry(layout.cardWidth, layout.cardHeight);
    return new StockPile(
        1,
        planeGeometry,
        layout.stockPilePosition,
        layout.stackOffsetFaceUp,
        layout.stackOffsetHidden,
        materialFront,
        materialBack,
        wastePile
    );
}

function createWastePile(layout: LayoutConfig): WastePile {
    const materialFront = createWastePileMaterial(layout.cardWidth, layout.cardHeight);
    const materialBack = materialFront;
    const planeGeometry = new THREE.PlaneGeometry(layout.cardWidth, layout.cardHeight);
    return new WastePile(
        2,
        planeGeometry,
        layout.wastePilePosition,
        layout.stackOffsetHidden,
        layout.stackOffsetHidden,
        materialFront,
        materialBack
    );
}

function createTableauPiles(layout: LayoutConfig): TableauPile[] {
    const materialFront = createTableauPileMaterial(layout.cardWidth, layout.cardHeight);
    const materialBack = materialFront;
    const planeGeometry = new THREE.PlaneGeometry(layout.cardWidth, layout.cardHeight);
    function create(index: number, position: vec3): TableauPile {
        return new TableauPile(
            index,
            planeGeometry,
            position,
            layout.stackOffsetFaceUp,
            layout.stackOffsetFaceDown,
            materialFront,
            materialBack
        );
    }
    const x = layout.tableauPilesPosition.x;
    const y = layout.tableauPilesPosition.y;
    const z = layout.tableauPilesPosition.z;

    return [
        create(3, vec3(x - layout.pileSpacing * 3, y, z)),
        create(4, vec3(x - layout.pileSpacing * 2, y, z)),
        create(5, vec3(x - layout.pileSpacing * 1, y, z)),
        create(6, vec3(x, y, z)),
        create(7, vec3(x + layout.pileSpacing * 1, y, z)),
        create(8, vec3(x + layout.pileSpacing * 2, y, z)),
        create(9, vec3(x + layout.pileSpacing * 3, y, z)),
    ];
}

function createFoundationPiles(layout: LayoutConfig): FoundationPile[] {
    const materialFront = createFoundationPileMaterial(layout.cardWidth, layout.cardHeight);
    const materialBack = materialFront;
    const planeGeometry = new THREE.PlaneGeometry(layout.cardWidth, layout.cardHeight);
    function create(index: number, position: vec3): FoundationPile {
        return new FoundationPile(
            index,
            planeGeometry,
            position,
            layout.stackOffsetHidden,
            layout.stackOffsetHidden,
            materialFront,
            materialBack
        );
    }
    const x = layout.foundationPilesPosition.x;
    const y = layout.foundationPilesPosition.y;
    const z = layout.foundationPilesPosition.z;

    return [
        create(10, vec3(x - layout.pileSpacing * 1.5, y, z)),
        create(11, vec3(x - layout.pileSpacing * 0.5, y, z)),
        create(12, vec3(x + layout.pileSpacing * 0.5, y, z)),
        create(13, vec3(x + layout.pileSpacing * 1.5, y, z)),
    ];
}
