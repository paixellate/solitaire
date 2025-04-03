import { describe, it, expect, vi, beforeEach } from "vitest";
import * as THREE from "three";
import { Game } from "../core/game";
import { Input } from "../input";
import { SelectionPile } from "../core/piles/selectionPile";
import { Selections } from "../core/rules/selection";
import { vec2 } from "../vector";
import { Board } from "../core/board";
import { History } from "../core/history";
import { Controls } from "../core/ui/controls";

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

describe("Game Integration Tests", () => {
    let game: Game;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Create scene
        const scene = new THREE.Scene();

        // Create game instance
        game = new Game(new Board(), new History(), new Controls());
        game.addToScene(scene);
    });

    it("should create a selection when clicking on a pile", () => {
        const stockPilePosition = vec2(450, 300);

        const selectionsSpy = vi.spyOn(Selections, "create");
        const setSelectionSpy = vi.spyOn(SelectionPile.prototype, "setSelection");

        const input = new Input();
        // Simulate mouse down on a pile
        input.mouse.position.set(stockPilePosition.x, stockPilePosition.y);
        input.mouse.isDown = true;

        // Run main loop
        game.mainLoop(input);

        // Verify selection logic was called with correct parameters
        expect(selectionsSpy).toHaveBeenCalledWith(input.mouse.position, game["board"]);

        // Capture the actual selection that was passed to setSelection
        const actualSelection = setSelectionSpy.mock.calls[0][0];

        // Verify selection was set
        expect(actualSelection).toBeDefined();

        if (actualSelection) {
            expect(actualSelection).toBe(game["selection"]);
            expect(actualSelection.source).toBe(game["board"].stockPile);
            expect(actualSelection.cards.length).toBeGreaterThan(0);

            // Verify the properties of the first card in the selection
            const firstCard = actualSelection.cards[0];
            expect(firstCard).toBeDefined();
            expect(firstCard.isFaceUp).toBe(false);
        }
    });
});
