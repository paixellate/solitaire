import { vec2, vec3 } from "../../graphics/vector";

export interface LayoutConfig {
    stackOffsetFaceUp: vec2;
    stackOffsetFaceDown: vec2;
    stackOffsetHidden: vec2;
    cardWidth: number;
    cardHeight: number;
    pileMargin: number;
    pileSpacing: number;
    pileSpacingVertical: number;
    boardWidth: number;
    boardHeight: number;
    boardPosition: vec3;
    topPileVerticalOffset: number;
    bottomPileVerticalOffset: number;
    foundationPilesPosition: vec3;
    wastePilePosition: vec3;
    stockPilePosition: vec3;
    tableauPilesPosition: vec3;
    selectionPilePosition: vec3;
    controlsVerticalOffset: number;
    buttonWidth: number;
    buttonHeight: number;
}

export function getDefaultLayout(windowWidth: number, windowHeight: number): LayoutConfig {
    return {
        // Card dimensions
        // max 100 and min depends on screen size
        get cardWidth() {
            return Math.min(windowWidth / 8.5, 100);
        },
        get cardHeight() {
            return this.cardWidth * 1.4;
        },

        // Card offsets
        get stackOffsetFaceUp() {
            if (this.cardWidth < 70) {
                return vec2(0, -this.cardHeight * 0.25);
            } else {
                return vec2(0, -this.cardHeight * 0.2);
            }
        },
        stackOffsetFaceDown: vec2(0, -2),
        stackOffsetHidden: vec2(0.1, -0.2),

        // Pile layout
        get pileMargin() {
            return this.cardWidth * 0.15;
        },
        get pileSpacing() {
            return this.pileMargin + this.cardWidth;
        },
        get pileSpacingVertical() {
            return 2 * this.pileMargin + this.cardHeight;
        },

        // Board dimensions
        get boardWidth() {
            return this.pileSpacing * 7.5;
        },
        get boardHeight() {
            return windowHeight;
        },
        boardPosition: vec3(0, 0, -1),

        get topPileVerticalOffset() {
            return this.boardHeight / 2 - this.pileSpacingVertical * 0.6;
        },
        get bottomPileVerticalOffset() {
            return this.topPileVerticalOffset - this.pileSpacingVertical;
        },

        // Pile positions
        get foundationPilesPosition() {
            return vec3(-1.5 * this.pileSpacing, this.topPileVerticalOffset, 0);
        },
        get wastePilePosition() {
            return vec3(2 * this.pileSpacing, this.topPileVerticalOffset, 0);
        },
        get stockPilePosition() {
            return vec3(3 * this.pileSpacing, this.topPileVerticalOffset, 0);
        },
        get tableauPilesPosition() {
            return vec3(0, this.bottomPileVerticalOffset, 0);
        },
        selectionPilePosition: vec3(0, 0, 0),

        // Controls
        get controlsVerticalOffset() {
            return -this.boardHeight / 2 + 80;
        },
        get buttonWidth() {
            return 50;
        },
        get buttonHeight() {
            return 50;
        },
    };
}
