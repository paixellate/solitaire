export interface GameState {
    stockEmpty: boolean;
    wasteEmpty: boolean;
    foundationCards: number[];
    tableauFaceUp: number[];
    tableauFaceDown: number[];
    moveCount: number;
    score: number;
    gameWon: boolean;
  }