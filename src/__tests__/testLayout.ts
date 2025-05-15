import { LayoutConfig } from "../core/layout";
import { vec2, vec3 } from "../vector";

export const TEST_LAYOUT: LayoutConfig = {
    // Card offsets
    stackOffsetFaceUp: vec2(0, -27),
    stackOffsetFaceDown: vec2(0, -2),
    stackOffsetHidden: vec2(0.1, -0.2),
    
    // Card dimensions
    cardWidth: 80,
    get cardHeight() { return this.cardWidth * 1.4; },
    
    // Pile layout
    pileMargin: 10,
    get pileSpacing() { return this.pileMargin + this.cardWidth; },
    
    // Board dimensions
    boardWidth: 800,
    boardHeight: 800,
    boardPosition: vec3(0, 0, -100),
  
    offsetYTop: 250,
    offsetYBottom: 110,
    
    // Pile positions
    get foundationPilesPosition() { return vec3(-1.5 * this.pileSpacing, this.offsetYTop, 0); },
    get wastePilePosition() { return vec3(2 * this.pileSpacing, this.offsetYTop, 0); },
    get stockPilePosition() { return vec3(3 * this.pileSpacing, this.offsetYTop, 0); },
    get tableauPilesPosition() { return vec3(0, this.offsetYBottom, 0); },
    selectionPilePosition: vec3(0, 0, 0)
  };
  