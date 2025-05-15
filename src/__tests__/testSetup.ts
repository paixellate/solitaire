import { MaterialCache } from "../texture/materialCache";
import { StockPile } from "../core/piles/concrete/stockPile";
import { TableauPile } from "../core/piles/concrete/tableauPile";
import { WastePile } from "../core/piles/concrete/wastePile";
import { SelectionPile } from "../core/piles/selectionPile";
import * as THREE from "three";
import { vec2, vec3 } from "../vector";
import { FoundationPile } from "../core/piles/concrete/foundationPile";
import { Deck } from "../core/cards/deck";
import { Board } from "../core/board";
import { History } from "../core/history";
import { Controls } from "../core/ui/controls";
import { Button } from "../core/ui/button";


export namespace TestSetup {
    const TEST_STACK_OFFSET_FACE_UP = vec2(0, -0.2);
    const TEST_STACK_OFFSET_FACE_DOWN = vec2(0, -0.04);
    const TEST_STACK_OFFSET_HIDDEN = vec2(0.001, -0.001);

    const TEST_BOARD_COLOR = "#060";
    const TEST_PILE_BACKGROUND_COLOR = "#040";
    const TEST_PILE_SYMBOL_COLOR = "#030";

    const TEST_BOARD_WIDTH = 1200;
    const TEST_BOARD_HEIGHT = 800;

    const TEST_CARD_WIDTH = 100;
    const TEST_CARD_HEIGHT = 140;

    export function test_createUndoButton(): Button {
        return new Button("↶", 50, 50, vec3(-600, 0, 0));
    }

    export function test_createBoard(): Board {
        const material = new THREE.MeshBasicMaterial({ color: TEST_BOARD_COLOR });

        const wastePile = test_createWastePile(vec3(250, 350, 0));
        const stockPile = test_createStockPile(vec3(400, 350, 0), wastePile);
        const tableauPiles = test_createTableauPiles(vec3(-500, 150, 0), 50);
        const foundationPiles = test_createFoundationPiles(vec3(-500, 350, 0), 50);
        const selectionPile = test_createSelectionPile();
        const history = new History();
        const planeGeometry = new THREE.PlaneGeometry(TEST_BOARD_WIDTH, TEST_BOARD_HEIGHT);
        const board = new Board(
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
        board.wastePile.addToObject(board);
        board.stockPile.addToObject(board);
        board.tableauPiles.forEach((pile) => pile.addToObject(board));
        board.foundationPiles.forEach((pile) => pile.addToObject(board));
        board.selectionPile.addToObject(board);
        return board;
    }

    export function test_setupBoard(board: Board): void {
    
        const deck = new Deck(TEST_CARD_WIDTH, TEST_CARD_HEIGHT);
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < i + 1; j++) {
                board.tableauPiles[i].addCard(deck.popOrThrow());
            }
        }
        board.stockPile.addCardsReversed(deck.popAllCards());
        board.tableauPiles.forEach((pile) => pile.getTopCardOrThrow().makeFaceUp());
    }

    export function test_createSelectionPile(): SelectionPile {
        const material = new THREE.MeshBasicMaterial({ color: TEST_BOARD_COLOR });
        material.transparent = true;
        material.opacity = 0.0;
        const planeGeometry = new THREE.PlaneGeometry(TEST_CARD_WIDTH, TEST_CARD_HEIGHT);
        return new SelectionPile(
            0,
            planeGeometry,
            vec3(0, 0, 0),
            TEST_STACK_OFFSET_FACE_UP,
            TEST_STACK_OFFSET_HIDDEN,
            material,
            material
        );
    }

    export function test_createStockPile(positionOffset: vec3, wastePile: WastePile): StockPile {
        const materialFront = MaterialCache.getInstance().getPileMaterial(
            "∅",
            TEST_PILE_BACKGROUND_COLOR,
            TEST_PILE_SYMBOL_COLOR,
            TEST_CARD_WIDTH,
            TEST_CARD_HEIGHT
        );
        const materialBack = MaterialCache.getInstance().getPileMaterial(
            "∅",
            TEST_PILE_BACKGROUND_COLOR,
            TEST_PILE_SYMBOL_COLOR,
            TEST_CARD_WIDTH,
            TEST_CARD_HEIGHT
        );
        const planeGeometry = new THREE.PlaneGeometry(TEST_CARD_WIDTH, TEST_CARD_HEIGHT);
        return new StockPile(
            1,
            planeGeometry,
            vec3(positionOffset.x + TEST_CARD_WIDTH / 2, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z),
            TEST_STACK_OFFSET_FACE_UP,
            TEST_STACK_OFFSET_HIDDEN,
            materialFront,
            materialBack,
            wastePile
        );
    }

    export function test_createWastePile(positionOffset: vec3): WastePile {
        const materialFront = MaterialCache.getInstance().getPileMaterial(
            "",
            TEST_PILE_BACKGROUND_COLOR,
            TEST_PILE_SYMBOL_COLOR,
            TEST_CARD_WIDTH,
            TEST_CARD_HEIGHT
        );
        const materialBack = MaterialCache.getInstance().getPileMaterial(
            "",
            TEST_PILE_BACKGROUND_COLOR,
            TEST_PILE_SYMBOL_COLOR,
            TEST_CARD_WIDTH,
            TEST_CARD_HEIGHT
        );
        const planeGeometry = new THREE.PlaneGeometry(TEST_CARD_WIDTH, TEST_CARD_HEIGHT);
        return new WastePile(
            2,
            planeGeometry,
            vec3(positionOffset.x + TEST_CARD_WIDTH / 2, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z),
            TEST_STACK_OFFSET_HIDDEN,
            TEST_STACK_OFFSET_HIDDEN,
            materialFront,
            materialBack
        );
    }

    export function test_createTableauPiles(positionOffset: vec3, spacing: number): TableauPile[] {
        const materialFront = MaterialCache.getInstance().getPileMaterial(
            "K",
            TEST_PILE_BACKGROUND_COLOR,
            TEST_PILE_SYMBOL_COLOR,
            TEST_CARD_WIDTH,
            TEST_CARD_HEIGHT
        );
        const materialBack = MaterialCache.getInstance().getPileMaterial(
            "K",
            TEST_PILE_BACKGROUND_COLOR,
            TEST_PILE_SYMBOL_COLOR,
            TEST_CARD_WIDTH,
            TEST_CARD_HEIGHT
        );
        const planeGeometry = new THREE.PlaneGeometry(TEST_CARD_WIDTH, TEST_CARD_HEIGHT);
        function create(index: number, position: vec3): TableauPile {
            return new TableauPile(
                index,
                planeGeometry,
                position,
                TEST_STACK_OFFSET_FACE_UP,
                TEST_STACK_OFFSET_FACE_DOWN,
                materialFront,
                materialBack
            );
        }

        return [
            create(
                3,
                vec3(positionOffset.x + (TEST_CARD_WIDTH * 1) / 2 + spacing * 0, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z)
            ),
            create(
                4,
                vec3(positionOffset.x + (TEST_CARD_WIDTH * 3) / 2 + spacing * 1, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z)
            ),
            create(
                5,
                vec3(positionOffset.x + (TEST_CARD_WIDTH * 5) / 2 + spacing * 2, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z)
            ),
            create(
                6,
                vec3(positionOffset.x + (TEST_CARD_WIDTH * 7) / 2 + spacing * 3, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z)
            ),
            create(
                7,
                vec3(positionOffset.x + (TEST_CARD_WIDTH * 9) / 2 + spacing * 4, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z)
            ),
            create(
                8,
                vec3(positionOffset.x + (TEST_CARD_WIDTH * 11) / 2 + spacing * 5, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z)
            ),
            create(
                9,
                vec3(positionOffset.x + (TEST_CARD_WIDTH * 13) / 2 + spacing * 6, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z)
            ),
        ];
    }

    export function test_createFoundationPiles(positionOffset: vec3, spacing: number): FoundationPile[] {
        const materialFront = MaterialCache.getInstance().getPileMaterial(
            "A",
            TEST_PILE_BACKGROUND_COLOR,
            TEST_PILE_SYMBOL_COLOR,
            TEST_CARD_WIDTH,
            TEST_CARD_HEIGHT
        );
        const materialBack = MaterialCache.getInstance().getPileMaterial(
            "A",
            TEST_PILE_BACKGROUND_COLOR,
            TEST_PILE_SYMBOL_COLOR,
            TEST_CARD_WIDTH,
            TEST_CARD_HEIGHT
        );
        const planeGeometry = new THREE.PlaneGeometry(TEST_CARD_WIDTH, TEST_CARD_HEIGHT);
        function create(index: number, position: vec3): FoundationPile {
            return new FoundationPile(
                index,
                planeGeometry,
                position,
                TEST_STACK_OFFSET_HIDDEN,
                TEST_STACK_OFFSET_HIDDEN,
                materialFront,
                materialBack
            );
        }

        return [
            create(
                10,
                vec3(positionOffset.x + (TEST_CARD_WIDTH * 1) / 2 + spacing * 0, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z)
            ),
            create(
                11,
                vec3(positionOffset.x + (TEST_CARD_WIDTH * 3) / 2 + spacing * 1, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z)
            ),
            create(
                12,
                vec3(positionOffset.x + (TEST_CARD_WIDTH * 5) / 2 + spacing * 2, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z)
            ),
            create(
                13,
                vec3(positionOffset.x + (TEST_CARD_WIDTH * 7) / 2 + spacing * 3, positionOffset.y - TEST_CARD_HEIGHT / 2, positionOffset.z)
            ),
        ];
    }

}
