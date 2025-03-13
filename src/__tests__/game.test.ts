import { expect, test, describe, beforeEach } from 'vitest';
import { Game } from '../game';
import { Card } from '../card';
import { Suit, Rank, PileType } from '../types';

describe('Game', () => {
  let game: Game;
  
  beforeEach(() => {
    game = new Game();
    // Setup the game to ensure a fresh state for each test
    game.setup();
  });
  
  test('should initialize a new game with correct setup', () => {
    // After setup and deal, stock should have 52 - (1+2+3+4+5+6+7) = 24 cards
    expect(game.stock.size()).toBe(24);
    
    // Waste pile should be empty
    expect(game.waste.isEmpty()).toBe(true);
    
    // Foundation piles should be empty
    game.foundations.forEach(foundation => {
      expect(foundation.isEmpty()).toBe(true);
    });
    
    // Tableau piles should have the correct number of cards
    for (let i = 0; i < 7; i++) {
      expect(game.tableau[i].size()).toBe(i + 1);
      
      // Check that only the top card is face up
      for (let j = 0; j < game.tableau[i].size(); j++) {
        if (j === game.tableau[i].size() - 1) {
          expect(game.tableau[i].cards[j].faceUp).toBe(true);
        } else {
          expect(game.tableau[i].cards[j].faceUp).toBe(false);
        }
      }
    }
    
    // No moves yet
    expect(game.moves.length).toBe(0);
    
    // Score should be 0
    expect(game.score).toBe(0);
  });
  
  test('drawCard() should move a card from stock to waste', () => {
    const stockSizeBefore = game.stock.size();
    const wasteSizeBefore = game.waste.size();
    
    const result = game.drawCard();
    
    expect(result).toBe(true);
    expect(game.stock.size()).toBe(stockSizeBefore - 1);
    expect(game.waste.size()).toBe(wasteSizeBefore + 1);
    expect(game.waste.peek()?.faceUp).toBe(true);
  });
  
  test('drawCard() should return false when stock is empty', () => {
    // Empty the stock pile
    while (game.stock.size() > 0) {
      game.drawCard();
    }
    
    const result = game.drawCard();
    expect(result).toBe(false);
  });
  
  test('resetStock() should move cards from waste back to stock', () => {
    // Draw some cards to waste
    for (let i = 0; i < 5; i++) {
      game.drawCard();
    }
    
    const wasteSizeBefore = game.waste.size();
    expect(wasteSizeBefore).toBeGreaterThan(0);
    
    const result = game.resetStock();
    
    expect(result).toBe(true);
    expect(game.waste.isEmpty()).toBe(true);
    expect(game.stock.size()).toBe(24); // Original stock size + waste cards
    
    // Check that cards in stock are face down
    for (const card of game.stock.cards) {
      expect(card.faceUp).toBe(false);
    }
    
    // Score should be reduced
    expect(game.score).toBe(-100);
  });
  
  test('resetStock() should return false when waste is empty', () => {
    expect(game.waste.isEmpty()).toBe(true);
    const result = game.resetStock();
    expect(result).toBe(false);
  });
  
  test('moveFromWasteToFoundation() should move a card if possible', () => {
    // Arrange: Set up a specific scenario
    game.waste.clear();
    game.foundations.forEach(f => f.clear());
    
    // Add an Ace of Hearts to the waste
    const aceHearts = new Card(Suit.HEARTS, Rank.ACE, true);
    game.waste.cards.push(aceHearts);
    
    const wasteSizeBefore = game.waste.size();
    const foundationSizeBefore = game.foundations.find(f => f.suit === Suit.HEARTS)!.size();
    
    // Act
    const result = game.moveFromWasteToFoundation();
    
    // Assert
    expect(result).toBe(true);
    expect(game.waste.size()).toBe(wasteSizeBefore - 1);
    expect(game.foundations.find(f => f.suit === Suit.HEARTS)!.size()).toBe(foundationSizeBefore + 1);
    expect(game.score).toBe(10); // Waste to foundation score
  });
  
  test('moveFromWasteToTableau() should move a card if possible', () => {
    // Arrange: Set up a specific scenario
    game.waste.clear();
    game.tableau[0].clear();
    
    // Add a King to the waste
    const kingHearts = new Card(Suit.HEARTS, Rank.KING, true);
    game.waste.cards.push(kingHearts);
    
    const wasteSizeBefore = game.waste.size();
    const tableauSizeBefore = game.tableau[0].size();
    
    // Act
    const result = game.moveFromWasteToTableau(0);
    
    // Assert
    expect(result).toBe(true);
    expect(game.waste.size()).toBe(wasteSizeBefore - 1);
    expect(game.tableau[0].size()).toBe(tableauSizeBefore + 1);
    expect(game.score).toBe(5); // Waste to tableau score
  });
  
  test('moveFromTableauToFoundation() should move a card if possible', () => {
    // Arrange: Set up a specific scenario
    game.tableau[0].clear();
    game.foundations.forEach(f => f.clear());
    
    // Add an Ace of Hearts to the tableau
    const aceHearts = new Card(Suit.HEARTS, Rank.ACE, true);
    game.tableau[0].cards.push(aceHearts);
    
    const tableauSizeBefore = game.tableau[0].size();
    const foundationSizeBefore = game.foundations.find(f => f.suit === Suit.HEARTS)!.size();
    
    // Act
    const result = game.moveFromTableauToFoundation(0);
    
    // Assert
    expect(result).toBe(true);
    expect(game.tableau[0].size()).toBe(tableauSizeBefore - 1);
    expect(game.foundations.find(f => f.suit === Suit.HEARTS)!.size()).toBe(foundationSizeBefore + 1);
    expect(game.score).toBe(10); // Tableau to foundation score
  });
  
  test('moveFromTableauToTableau() should move cards if possible', () => {
    // Arrange: Set up a specific scenario
    game.tableau[0].clear();
    game.tableau[1].clear();
    
    // Add a Queen of Hearts to tableau 0
    const queenHearts = new Card(Suit.HEARTS, Rank.QUEEN, true);
    game.tableau[0].cards.push(queenHearts);
    
    // Add a King of Spades to tableau 1
    const kingSpades = new Card(Suit.SPADES, Rank.KING, true);
    game.tableau[1].cards.push(kingSpades);
    
    const fromSizeBefore = game.tableau[0].size();
    const toSizeBefore = game.tableau[1].size();
    
    // Act
    const result = game.moveFromTableauToTableau(0, 1, 0);
    
    // Assert
    expect(result).toBe(true);
    expect(game.tableau[0].size()).toBe(fromSizeBefore - 1);
    expect(game.tableau[1].size()).toBe(toSizeBefore + 1);
    expect(game.tableau[1].peek()).toEqual(queenHearts);
  });
  
  test('moveFromFoundationToTableau() should move a card if possible', () => {
    // Arrange: Set up a specific scenario
    game.foundations.forEach(f => f.clear());
    game.tableau[0].clear();
    
    // Add a Queen of Hearts to foundation
    const heartFoundation = game.foundations.find(f => f.suit === Suit.HEARTS)!;
    
    // Add Ace through Queen
    for (let rank = 1; rank <= 12; rank++) {
      heartFoundation.cards.push(new Card(Suit.HEARTS, rank as Rank, true));
    }
    
    // Add a King of Spades to tableau
    const kingSpades = new Card(Suit.SPADES, Rank.KING, true);
    game.tableau[0].cards.push(kingSpades);
    
    const foundationSizeBefore = heartFoundation.size();
    const tableauSizeBefore = game.tableau[0].size();
    
    // Act
    const foundationIndex = game.foundations.indexOf(heartFoundation);
    const result = game.moveFromFoundationToTableau(foundationIndex, 0);
    
    // Assert
    expect(result).toBe(true);
    expect(heartFoundation.size()).toBe(foundationSizeBefore - 1);
    expect(game.tableau[0].size()).toBe(tableauSizeBefore + 1);
    expect(game.score).toBe(-15); // Foundation to tableau score
  });
  
  test('undo() should revert the last move', () => {
    // Arrange: Make a move first
    game.waste.clear();
    game.tableau[0].clear();
    
    // Add a King to the waste
    const kingHearts = new Card(Suit.HEARTS, Rank.KING, true);
    game.waste.cards.push(kingHearts);
    
    // Move it to the tableau
    game.moveFromWasteToTableau(0);
    
    const wasteSizeBefore = game.waste.size();
    const tableauSizeBefore = game.tableau[0].size();
    const scoreBefore = game.score;
    
    // Act
    const result = game.undo();
    
    // Assert
    expect(result).toBe(true);
    expect(game.waste.size()).toBe(wasteSizeBefore + 1);
    expect(game.tableau[0].size()).toBe(tableauSizeBefore - 1);
    expect(game.waste.peek()).toEqual(kingHearts);
    expect(game.moves.length).toBe(0);
  });
  
  test('canUndo() should return true if there are moves to undo', () => {
    // Arrange
    expect(game.canUndo()).toBe(false);
    
    // Setup a move
    game.waste.clear();
    const aceHearts = new Card(Suit.HEARTS, Rank.ACE, true);
    game.waste.cards.push(aceHearts);
    
    game.moveFromWasteToFoundation();
    
    // Assert
    expect(game.canUndo()).toBe(true);
  });
  
  test('getState() should return the current game state', () => {
    // Act
    const state = game.getState();
    
    // Assert
    expect(state).toHaveProperty('stockEmpty');
    expect(state).toHaveProperty('wasteEmpty');
    expect(state).toHaveProperty('foundationCards');
    expect(state).toHaveProperty('tableauFaceUp');
    expect(state).toHaveProperty('tableauFaceDown');
    expect(state).toHaveProperty('moveCount');
    expect(state).toHaveProperty('score');
    expect(state).toHaveProperty('gameWon');
    
    expect(state.stockEmpty).toBe(false);
    expect(state.wasteEmpty).toBe(true);
    expect(state.foundationCards.length).toBe(4);
    expect(state.tableauFaceUp.length).toBe(7);
    expect(state.tableauFaceDown.length).toBe(7);
    expect(state.moveCount).toBe(0);
    expect(state.score).toBe(0);
    expect(state.gameWon).toBe(false);
  });
  
  test('isGameWon() should return true when all foundations are complete', () => {
    // Arrange
    game.foundations.forEach(f => f.clear());
    
    // Add all cards to the foundations
    for (const foundation of game.foundations) {
      const suit = foundation.suit!;
      for (let rank = 1; rank <= 13; rank++) {
        foundation.cards.push(new Card(suit, rank as Rank, true));
      }
    }
    
    // Act & Assert
    expect(game.isGameWon()).toBe(true);
  });
  
  test('findValidMoves() should return valid moves', () => {
    // Arrange
    game.reset();
    
    // Clear all piles
    game.stock.clear();
    game.waste.clear();
    game.foundations.forEach(f => f.clear());
    game.tableau.forEach(t => t.clear());
    
    // Add an Ace of Hearts to the waste
    const aceHearts = new Card(Suit.HEARTS, Rank.ACE, true);
    game.waste.cards.push(aceHearts);
    
    // Add a King of Spades to tableau 0
    const kingSpades = new Card(Suit.SPADES, Rank.KING, true);
    game.tableau[0].cards.push(kingSpades);
    
    // Act
    const validMoves = game.findValidMoves();
    
    // Assert
    expect(validMoves.length).toBeGreaterThanOrEqual(2); // Waste to foundation and waste to tableau
    
    // Check that the moves include the expected types
    const moveTypes = validMoves.map(move => ({
      fromType: move.fromPile.type,
      toType: move.toPile.type
    }));
    
    expect(moveTypes).toContainEqual({
      fromType: PileType.WASTE,
      toType: PileType.FOUNDATION
    });
  });
  
  test('autoMove() should automatically move cards to foundations when possible', () => {
    // Arrange
    game.waste.clear();
    game.foundations.forEach(f => f.clear());
    
    // Add an Ace of Hearts to the waste
    const aceHearts = new Card(Suit.HEARTS, Rank.ACE, true);
    game.waste.cards.push(aceHearts);
    
    // Act
    const result = game.autoMove();
    
    // Assert
    expect(result).toBe(true);
    expect(game.waste.isEmpty()).toBe(true);
    expect(game.foundations.find(f => f.suit === Suit.HEARTS)!.size()).toBe(1);
  });
});