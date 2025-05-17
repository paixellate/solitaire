import { StockPile } from "./piles/stockPile";
import { TableauPile } from "./piles/tableauPile";
import { WastePile } from "./piles/wastePile";
import { SelectionPile } from "./selection/selectionPile";
import * as THREE from "three";
import { vec3 } from "../graphics/vector";
import { FoundationPile } from "./piles/foundationPile";
import { Deck } from "./deck";
import { Board } from "./board";
import { History } from "./history/history";
import { Controls } from "./controls";
import { Button } from "./ui/button";
import {
    createBoardMaterial,
    createStockPileMaterial,
    createWastePileMaterial,
    createTableauPileMaterial,
    createFoundationPileMaterial,
    createSelectionPileMaterial,
} from "../graphics/material/materials";
import { LayoutConfig } from "./ui/layout";

export function createControls(layout: LayoutConfig): Controls {
    const undoButton = new Button(
        "↶",
        layout.buttonWidth,
        layout.buttonHeight,
        vec3(-layout.buttonWidth - 10, layout.controlsVerticalOffset, 0)
    );
    const restartButton = new Button("↺", layout.buttonWidth, layout.buttonHeight, vec3(0, layout.controlsVerticalOffset, 0));
    const newGameButton = new Button(
        "X",
        layout.buttonWidth,
        layout.buttonHeight,
        vec3(layout.buttonWidth + 10, layout.controlsVerticalOffset, 0)
    );
    return new Controls(undoButton, restartButton, newGameButton);
}

export function createBoard(layout: LayoutConfig, seed: number): Board {
    const planeGeometry = new THREE.PlaneGeometry(layout.boardWidth, layout.boardHeight);
    const history = new History(seed);
    const material = createBoardMaterial();
    const deck = new Deck(layout.cardWidth, layout.cardHeight);
    const wastePile = createWastePile(layout);
    const stockPile = createStockPile(layout);
    const tableauPiles = createTableauPiles(layout);
    const foundationPiles = createFoundationPiles(layout);
    const selectionPile = createSelectionPile(layout);

    const board = new Board(
        planeGeometry,
        layout.boardPosition,
        material,
        deck,
        wastePile,
        stockPile,
        tableauPiles,
        foundationPiles,
        selectionPile,
        history
    );

    wastePile.addToObject(board);
    stockPile.addToObject(board);
    tableauPiles.forEach((pile) => pile.addToObject(board));
    foundationPiles.forEach((pile) => pile.addToObject(board));
    selectionPile.addToObject(board);

    return board;
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

function createStockPile(layout: LayoutConfig): StockPile {
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
        materialBack
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
