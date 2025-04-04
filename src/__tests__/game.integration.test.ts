import { describe, it, expect, vi, beforeEach } from "vitest";
import * as THREE from "three";
import { Input } from "../input";
import { Selections } from "../core/rules/selection";
import { vec2, vec3 } from "../vector";
import { Board } from "../core/board";
import { TestSetup } from "./testSetup";
import { getRankValue, Rank } from "../core/cards/rank";
import { Controls } from "../core/ui/controls";
import { isOppositeColor, Suit } from "../core/cards/suit";
import { TableauPile } from "../core/piles/board/tableauPile";
import { Game } from "../core/game";
import { Button } from "../core/ui/button";

// Create minimal mocks for THREE.js objects we need to control
vi.mock("three", async () => {
    const actual = await vi.importActual<typeof THREE>("three");
    return {
        ...actual,
        // Mock texture and material classes to avoid actual GPU operations
        Texture: vi.fn().mockImplementation(() => ({
            needsUpdate: false,
        })),
        MeshBasicMaterial: vi.fn().mockImplementation(() => ({
            side: 0,
            transparent: false,
            opacity: 1.0,
            map: null,
        })),
    };
});

// Mock TextureCache to avoid loading real textures
vi.mock("../texture/textureCache", () => {
    return {
        TextureCache: {
            getInstance: vi.fn().mockReturnValue({
                getTexture: vi.fn().mockReturnValue({
                    needsUpdate: false,
                }),
            }),
        },
    };
});

// Mock MaterialCache but preserve its behavior
vi.mock("../texture/materialCache", () => {
    const mockMaterial = {
        side: 0,
        transparent: false,
        opacity: 1.0,
        map: null,
    };

    return {
        MaterialCache: {
            getInstance: vi.fn().mockReturnValue({
                getPileMaterial: vi.fn().mockReturnValue(mockMaterial),
                getCardMaterial: vi.fn().mockReturnValue(mockMaterial),
                getCardBackMaterial: vi.fn().mockReturnValue(mockMaterial),
                getButtonMaterial: vi.fn().mockReturnValue(mockMaterial),
            }),
        },
    };
});

describe("Board", () => {
    let board: Board;
    let game: Game;
    let undoButton: Button;
    let input: Input;

    beforeAll(() => {
        input = new Input();
        undoButton = TestSetup.test_createUndoButton();
        board = TestSetup.test_createBoard();
        game = new Game(board, new Controls(undoButton));
        TestSetup.test_setupBoard(board);
        const deck = TestSetup.test_createDeck();
        TestSetup.test_dealCards(deck, board.stockPile, board.tableauPiles);
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    function verifyBoardConsistency(board: Board) {
        // verify that the total number of cards across waste, stock, tableau, foundation and selection piles is 52.
        const wastPileNumCards = board.wastePile.getNumberOfCards();
        const stockPileNumCards = board.stockPile.getNumberOfCards();
        const tableauPilesNumCards = board.tableauPiles.reduce((acc, pile) => acc + pile.getNumberOfCards(), 0);
        const foundationPilesNumCards = board.foundationPiles.reduce((acc, pile) => acc + pile.getNumberOfCards(), 0);
        const selectionNumCards = board.selection?.cards?.length ?? 0;
        const totalCards = wastPileNumCards + stockPileNumCards + tableauPilesNumCards + foundationPilesNumCards + selectionNumCards;
        expect(totalCards).toBe(52);

        // selectionPile and selection have the same number of cards
        expect(board.selectionPile.getNumberOfCards()).toBe(selectionNumCards);

        // prettier-ignore
        {
            expect(board.foundationPiles[0].test_getAllCards().every((card) => card.isFaceUp)).toBeTruthy();
            expect(board.foundationPiles[1].test_getAllCards().every((card) => card.isFaceUp)).toBeTruthy();
            expect(board.foundationPiles[2].test_getAllCards().every((card) => card.isFaceUp)).toBeTruthy();
            expect(board.foundationPiles[3].test_getAllCards().every((card) => card.isFaceUp)).toBeTruthy();

            expect(board.stockPile.test_getAllCards().every((card) => !card.isFaceUp)).toBeTruthy();

            expect(board.wastePile.test_getAllCards().every((card) => card.isFaceUp)).toBeTruthy();
        }
    }

    // prettier-ignore
    function verifyTableauPile(tableauPile: TableauPile, faceDownCardNum: number, faceUpCardNum: number) {
        expect(tableauPile.getNumberOfCards()).toBe(faceDownCardNum + faceUpCardNum);
        const faceDownCards = tableauPile.test_getAllCards().slice(0, faceDownCardNum);
        expect(faceDownCards.every((card) => !card.isFaceUp)).toBeTruthy();

        const faceUpCards = tableauPile.test_getAllCards().slice(faceDownCardNum, faceDownCardNum + faceUpCardNum);
        expect(faceUpCards.every((card) => card.isFaceUp)).toBeTruthy();

        // verify that the faceUp cards are in legal order for a tableau pile which requires alternating colors and descending ranks
        for (let i = 0; i < faceUpCardNum - 1; i++) {
            const cardBelow = faceUpCards[i];
            const cardAbove = faceUpCards[i + 1];
            expect(isOppositeColor(cardBelow.suit, cardAbove.suit)).toBeTruthy();
            expect(getRankValue(cardBelow.rank)).toBe(getRankValue(cardAbove.rank) + 1);
        }
    }

    it("should correctly deal cards to the piles", () => {
        verifyTableauPile(board.tableauPiles[0], 0, 1);
        verifyTableauPile(board.tableauPiles[1], 1, 1);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 1);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 6, 1);

        board.foundationPiles.forEach((pile) => expect(pile.getNumberOfCards()).toBe(0));

        expect(board.stockPile.getNumberOfCards()).toBe(24);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
    });

    it("should create a selection when mouse down on a pile", () => {
        const stockPilePosition = vec2(450, 350);

        const spySelections_create = vi.spyOn(Selections, "create");
        const spySelectionPile_set = vi.spyOn(board.selectionPile, "set");

        // Simulate mouse down on a pile
        input.mouse.position.set(stockPilePosition.x, stockPilePosition.y);
        input.mouse.isDown = true;

        // Run main loop
        game.mainLoop(input);

        // Verify selection logic was called with correct parameters
        expect(spySelections_create).toHaveBeenCalledWith(input.mouse.position, board);

        // Capture the actual selection that was passed to setSelection
        const actualSelection = spySelectionPile_set.mock.calls[0][0];

        // Verify selection was set
        expect(actualSelection).not.toBeNull();
        expect(actualSelection).toBe(board.selection);
        expect(actualSelection?.mousePosition).toEqual(vec2(450, 350));
        expect(actualSelection?.cardPosition?.x).toBeCloseTo(452.3);
        expect(actualSelection?.cardPosition?.y).toBeCloseTo(276.78);
        expect(actualSelection?.cardPosition?.z).toBeCloseTo(-76);
        expect(actualSelection?.source).toBe(board.stockPile);
        expect(actualSelection?.cards.length).toEqual(1);

        // Verify the properties of the first card in the selection
        const card = actualSelection?.cards[0];
        expect(card).not.toBeNull();
        expect(card?.rank).toBe(Rank.JACK);
        expect(card?.suit).toBe(Suit.DIAMONDS);
        expect(card?.isFaceUp).toBe(false);

        expect(board.selectionPile.test_getAllCards().every((card) => !card.isFaceUp)).toBeTruthy();

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 1);
        verifyTableauPile(board.tableauPiles[1], 1, 1);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 1);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 6, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(0);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(23);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);
    });

    it("should create and execute a move when mouse up after selection", () => {
        const stockPilePosition = vec2(450, 350);

        // Simulate mouse down on a pile
        input.mouse.position.set(stockPilePosition.x, stockPilePosition.y);
        input.mouse.isDown = false;

        // Run main loop
        game.mainLoop(input);

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 1);
        verifyTableauPile(board.tableauPiles[1], 1, 1);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 1);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 6, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(0);
        expect(board.wastePile.getNumberOfCards()).toBe(1);
        expect(board.stockPile.getNumberOfCards()).toBe(23);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(1);
    });

    it("should select and drag a card to a tableau pile", () => {
        const wastePilePosition = board.wastePile.getGlobalPosition();
        const tableauPile4Position = board.tableauPiles[4].getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(wastePilePosition.x, wastePilePosition.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);

        input.mouse.position.set(tableauPile4Position.x, tableauPile4Position.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);

        input.mouse.isDown = false;

        game.mainLoop(input);

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 1);
        verifyTableauPile(board.tableauPiles[1], 1, 1);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 6, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(0);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(23);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(2);
    });

    it("should select and drag a card between tableau piles", () => {
        const tableauPile1Position = board.tableauPiles[1].getGlobalPosition();
        const tableauPile6Position = board.tableauPiles[6].getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(tableauPile1Position.x, tableauPile1Position.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        verifyTableauPile(board.tableauPiles[1], 1, 0);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);

        input.mouse.position.set(tableauPile6Position.x, tableauPile6Position.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        verifyTableauPile(board.tableauPiles[1], 1, 0);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);

        input.mouse.isDown = false;

        game.mainLoop(input);

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 1);
        verifyTableauPile(board.tableauPiles[1], 0, 1);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 6, 2);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(0);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(23);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(3);
    });

    it("should select and drag multiple cards between tableau piles", () => {
        const tableauPile6Position = board.tableauPiles[6].getGlobalPosition();
        tableauPile6Position.y += 20;
        const tableauPile0Position = board.tableauPiles[0].getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(tableauPile6Position.x, tableauPile6Position.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        verifyTableauPile(board.tableauPiles[6], 6, 0);
        expect(board.selectionPile.getNumberOfCards()).toBe(2);

        input.mouse.position.set(tableauPile6Position.x, tableauPile6Position.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        verifyTableauPile(board.tableauPiles[0], 0, 1);
        expect(board.selectionPile.getNumberOfCards()).toBe(2);

        input.mouse.isDown = false;

        game.mainLoop(input);

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 1);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 5, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(0);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(23);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(4);
    });

    it("should reset the piles when card dropped to invalid position", () => {
        const tableauPile0Position = board.tableauPiles[0].getGlobalPosition();
        tableauPile0Position.y += 20;
        const invalidPosition = vec3(2000, 2000, 0);

        // Simulate mouse down on a pile
        input.mouse.position.set(tableauPile0Position.x, tableauPile0Position.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        verifyTableauPile(board.tableauPiles[0], 0, 1);
        expect(board.selectionPile.getNumberOfCards()).toBe(2);

        input.mouse.position.set(invalidPosition.x, invalidPosition.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        verifyTableauPile(board.tableauPiles[0], 0, 1);
        expect(board.selectionPile.getNumberOfCards()).toBe(2);

        input.mouse.isDown = false;

        game.mainLoop(input);

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 1);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 5, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(0);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(23);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(4);
    });

    it("should auto move a card between tableau piles", () => {
        const tableauPile1Position = board.tableauPiles[1].getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(tableauPile1Position.x, tableauPile1Position.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        verifyTableauPile(board.tableauPiles[1], 0, 0);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);

        input.mouse.position.set(tableauPile1Position.x, tableauPile1Position.y);
        input.mouse.isDown = false;

        game.mainLoop(input);

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 0);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 5, 2);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(0);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(23);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(5);
    });

    it("should auto move multiple cards between tableau piles", () => {
        const tableauPile6Position = board.tableauPiles[6].getGlobalPosition();
        tableauPile6Position.y += 20;

        // Simulate mouse down on a pile
        input.mouse.position.set(tableauPile6Position.x, tableauPile6Position.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        verifyTableauPile(board.tableauPiles[6], 5, 0);
        expect(board.selectionPile.getNumberOfCards()).toBe(2);

        input.mouse.position.set(tableauPile6Position.x, tableauPile6Position.y);
        input.mouse.isDown = false;

        game.mainLoop(input);

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 2);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 4, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(0);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(23);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(6);
    });

    it("should select and drag a card from tableau to foundation pile", () => {
        const tableauPile6Position = board.tableauPiles[6].getGlobalPosition();
        const foundationPile0Position = board.foundationPiles[0].getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(tableauPile6Position.x, tableauPile6Position.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        verifyTableauPile(board.tableauPiles[6], 4, 0);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);

        input.mouse.position.set(foundationPile0Position.x, foundationPile0Position.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        verifyTableauPile(board.tableauPiles[6], 4, 0);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);

        input.mouse.isDown = false;

        game.mainLoop(input);

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 2);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 3, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(1);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(0);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(23);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(7);
    });

    it("should auto move a card from tableau to foundation pile", () => {
        const tableauPile6Position = board.tableauPiles[6].getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(tableauPile6Position.x, tableauPile6Position.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        verifyTableauPile(board.tableauPiles[6], 3, 0);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);

        input.mouse.position.set(tableauPile6Position.x, tableauPile6Position.y);
        input.mouse.isDown = false;

        game.mainLoop(input);

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 2);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 2, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(2);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(0);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(23);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(8);
    });

    it("should select and drag a card from stock pile to waste pile", () => {
        const stockPilePosition = board.stockPile.getGlobalPosition();
        const wastePilePosition = board.wastePile.getGlobalPosition();

        input.mouse.position.set(stockPilePosition.x, stockPilePosition.y);
        input.mouse.isDown = true;
        game.mainLoop(input);
        verifyBoardConsistency(board);

        expect(board.stockPile.getNumberOfCards()).toBe(22);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);

        input.mouse.position.set(wastePilePosition.x, wastePilePosition.y);
        input.mouse.isDown = true;
        game.mainLoop(input);
        verifyBoardConsistency(board);

        expect(board.stockPile.getNumberOfCards()).toBe(22);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);

        input.mouse.isDown = false;
        game.mainLoop(input);
        verifyBoardConsistency(board);

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 2);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 2, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(2);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(0);
        expect(board.wastePile.getNumberOfCards()).toBe(1);
        expect(board.stockPile.getNumberOfCards()).toBe(22);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(9);
    });

    it("should select and drag a card from waste pile to foundation pile", () => {
        const stockPilePosition = board.stockPile.getGlobalPosition();
        const wastePilePosition = board.wastePile.getGlobalPosition();
        const foundationPile3Position = board.foundationPiles[3].getGlobalPosition();

        input.mouse.position.set(stockPilePosition.x, stockPilePosition.y);
        function clickStockPile() {
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        // empty out the stock pile
        for (let i = 0; i < 22; i++) {
            clickStockPile();
        }

        expect(board.wastePile.getNumberOfCards()).toBe(23);
        expect(board.stockPile.getNumberOfCards()).toBe(0);

        input.mouse.position.set(wastePilePosition.x, wastePilePosition.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        expect(board.wastePile.getNumberOfCards()).toBe(22);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);

        input.mouse.position.set(foundationPile3Position.x, foundationPile3Position.y);
        input.mouse.isDown = true;

        game.mainLoop(input);

        verifyBoardConsistency(board);
        expect(board.wastePile.getNumberOfCards()).toBe(22);
        expect(board.selectionPile.getNumberOfCards()).toBe(1);

        input.mouse.isDown = false;

        game.mainLoop(input);

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 2);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 2, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(2);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(1);
        expect(board.wastePile.getNumberOfCards()).toBe(22);
        expect(board.stockPile.getNumberOfCards()).toBe(0);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(32);
    });

    it("auto move cards from waste to foundation piles", () => {
        const wastePilePosition = board.wastePile.getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(wastePilePosition.x, wastePilePosition.y);

        function clickWastePile() {
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        for (let i = 0; i < 12; i++) {
            clickWastePile();
        }

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 2);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 2, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(2);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(13);
        expect(board.wastePile.getNumberOfCards()).toBe(10);
        expect(board.stockPile.getNumberOfCards()).toBe(0);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(44);
    });

    it("should auto refill stock from waste pile", () => {
        const stockPilePosition = board.stockPile.getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(stockPilePosition.x, stockPilePosition.y);
        function clickStockPile() {
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        // click one more time to refill stock
        clickStockPile();

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 2);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 2, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(2);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(13);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(10);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(45);
    });

    it("auto move all cards from tableau pile 6", () => {
        const tableauPile6Position = board.tableauPiles[6].getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(tableauPile6Position.x, tableauPile6Position.y);

        function clickTableauPile6() {
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        clickTableauPile6();
        clickTableauPile6();
        clickTableauPile6();

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 2);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 0, 0);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(5);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(13);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(10);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(48);
    });

    it("auto move all cards from tableau pile 5", () => {
        const tableauPile5Position = board.tableauPiles[5].getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(tableauPile5Position.x, tableauPile5Position.y);

        function clickTableauPile5() {
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        clickTableauPile5();
        clickTableauPile5();
        clickTableauPile5();
        clickTableauPile5();
        clickTableauPile5();
        clickTableauPile5();

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 2);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 2);
        verifyTableauPile(board.tableauPiles[5], 0, 0);
        verifyTableauPile(board.tableauPiles[6], 0, 0);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(11);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(13);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(10);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(54);
    });

    it("auto move all cards from tableau pile 4", () => {
        const tableauPile4Position = board.tableauPiles[4].getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(tableauPile4Position.x, tableauPile4Position.y);

        function clickTableauPile4() {
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        clickTableauPile4();
        clickTableauPile4();
        clickTableauPile4();
        clickTableauPile4();
        clickTableauPile4();
        clickTableauPile4();

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 3);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 0, 0);
        verifyTableauPile(board.tableauPiles[5], 0, 0);
        verifyTableauPile(board.tableauPiles[6], 0, 0);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(13);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(3);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(13);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(10);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(60);
    });

    it("auto move all cards from tableau pile 3", () => {
        const tableauPile3Position = board.tableauPiles[3].getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(tableauPile3Position.x, tableauPile3Position.y);

        function clickTableauPile3() {
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        clickTableauPile3();
        clickTableauPile3();
        clickTableauPile3();
        clickTableauPile3();

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 3);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 0, 0);
        verifyTableauPile(board.tableauPiles[4], 0, 0);
        verifyTableauPile(board.tableauPiles[5], 0, 0);
        verifyTableauPile(board.tableauPiles[6], 0, 0);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(13);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(7);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(13);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(10);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(64);
    });

    it("auto move all cards from tableau pile 2", () => {
        const tableauPile2Position = board.tableauPiles[2].getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(tableauPile2Position.x, tableauPile2Position.y);

        function clickTableauPile2() {
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        clickTableauPile2();
        clickTableauPile2();
        clickTableauPile2();

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 3);
        verifyTableauPile(board.tableauPiles[2], 0, 0);
        verifyTableauPile(board.tableauPiles[3], 0, 0);
        verifyTableauPile(board.tableauPiles[4], 0, 0);
        verifyTableauPile(board.tableauPiles[5], 0, 0);
        verifyTableauPile(board.tableauPiles[6], 0, 0);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(13);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(10);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(13);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(10);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(67);
    });

    it("auto move all cards from stock to foundation pile 2", () => {
        const stockPilePosition = board.stockPile.getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(stockPilePosition.x, stockPilePosition.y);

        function clickStockPile() {
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        for (let i = 0; i < 10; i++) {
            clickStockPile();
        }

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 3);
        verifyTableauPile(board.tableauPiles[2], 0, 0);
        verifyTableauPile(board.tableauPiles[3], 0, 0);
        verifyTableauPile(board.tableauPiles[4], 0, 0);
        verifyTableauPile(board.tableauPiles[5], 0, 0);
        verifyTableauPile(board.tableauPiles[6], 0, 0);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(13);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(10);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(13);
        expect(board.wastePile.getNumberOfCards()).toBe(10);
        expect(board.stockPile.getNumberOfCards()).toBe(0);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(77);

        const wastePilePosition = board.wastePile.getGlobalPosition();

        // Simulate mouse down on a pile
        input.mouse.position.set(wastePilePosition.x, wastePilePosition.y);

        function clickWastePile() {
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        for (let i = 0; i < 10; i++) {
            clickWastePile();
        }

        verifyTableauPile(board.tableauPiles[0], 0, 3);
        verifyTableauPile(board.tableauPiles[1], 0, 3);
        verifyTableauPile(board.tableauPiles[2], 0, 0);
        verifyTableauPile(board.tableauPiles[3], 0, 0);
        verifyTableauPile(board.tableauPiles[4], 0, 0);
        verifyTableauPile(board.tableauPiles[5], 0, 0);
        verifyTableauPile(board.tableauPiles[6], 0, 0);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(13);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(10);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(10);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(13);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(0);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(87);
    });

    it("should finish the game", () => {
        const tableauPile1Position = board.tableauPiles[1].getGlobalPosition();
        const tableauPile0Position = board.tableauPiles[0].getGlobalPosition();

        function clickTableauPile1() {
            input.mouse.position.set(tableauPile1Position.x, tableauPile1Position.y);
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        function clickTableauPile0() {
            input.mouse.position.set(tableauPile0Position.x, tableauPile0Position.y);
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        clickTableauPile1();
        clickTableauPile0();
        clickTableauPile1();
        clickTableauPile0();
        clickTableauPile1();
        clickTableauPile0();

        verifyTableauPile(board.tableauPiles[0], 0, 0);
        verifyTableauPile(board.tableauPiles[1], 0, 0);
        verifyTableauPile(board.tableauPiles[2], 0, 0);
        verifyTableauPile(board.tableauPiles[3], 0, 0);
        verifyTableauPile(board.tableauPiles[4], 0, 0);
        verifyTableauPile(board.tableauPiles[5], 0, 0);
        verifyTableauPile(board.tableauPiles[6], 0, 0);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(13);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(13);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(13);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(13);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(0);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(93);
    });

    it("should allow undoing the whole game", () => {
        const undoButtonPosition = undoButton.getGlobalPosition();

        function clickUndoButton() {
            input.mouse.position.set(undoButtonPosition.x, undoButtonPosition.y);
            input.mouse.isDown = true;
            game.mainLoop(input);
            verifyBoardConsistency(board);

            input.mouse.isDown = false;
            game.mainLoop(input);
            verifyBoardConsistency(board);
        }

        for (let i = 0; i < 93; i++) {
            clickUndoButton();
            verifyBoardConsistency(board);
        }

        verifyBoardConsistency(board);

        verifyTableauPile(board.tableauPiles[0], 0, 1);
        verifyTableauPile(board.tableauPiles[1], 1, 1);
        verifyTableauPile(board.tableauPiles[2], 2, 1);
        verifyTableauPile(board.tableauPiles[3], 3, 1);
        verifyTableauPile(board.tableauPiles[4], 4, 1);
        verifyTableauPile(board.tableauPiles[5], 5, 1);
        verifyTableauPile(board.tableauPiles[6], 6, 1);
        expect(board.foundationPiles[0].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[1].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[2].getNumberOfCards()).toBe(0);
        expect(board.foundationPiles[3].getNumberOfCards()).toBe(0);
        expect(board.wastePile.getNumberOfCards()).toBe(0);
        expect(board.stockPile.getNumberOfCards()).toBe(24);
        expect(board.selectionPile.getNumberOfCards()).toBe(0);

        expect(board.selection).toBeNull();
        expect(board.history.getNumberOfMoves()).toBe(0);
    });
});
