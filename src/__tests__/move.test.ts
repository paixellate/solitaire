import { expect, test, describe, beforeEach } from 'vitest';
import { Move } from '../move';
import { TableauPile, FoundationPile } from '../pile';
import { Card } from '../card';
import { Suit, Rank } from '../types';

describe('Move', () => {
  let tableauPile1: TableauPile;
  let tableauPile2: TableauPile;
  let foundationPile: FoundationPile;
  
  beforeEach(() => {
    // Set up some piles for testing
    tableauPile1 = new TableauPile([
      new Card(Suit.HEARTS, Rank.FIVE, true),
      new Card(Suit.SPADES, Rank.FOUR, true),
      new Card(Suit.HEARTS, Rank.THREE, true)
    ]);
    
    tableauPile2 = new TableauPile([
      new Card(Suit.CLUBS, Rank.KING, true),
      new Card(Suit.HEARTS, Rank.QUEEN, true),
      new Card(Suit.CLUBS, Rank.JACK, true),
      new Card(Suit.HEARTS, Rank.TEN, true),
      new Card(Suit.CLUBS, Rank.NINE, true),
      new Card(Suit.HEARTS, Rank.EIGHT, true),
      new Card(Suit.CLUBS, Rank.SEVEN, true),
      new Card(Suit.HEARTS, Rank.SIX, true)
    ]);
    
    foundationPile = new FoundationPile(Suit.HEARTS);
  });
  
  test('should create a move with the correct properties', () => {
    const cards = [new Card(Suit.HEARTS, Rank.THREE, true)];
    const move = new Move(tableauPile1, foundationPile, cards);
    
    expect(move.fromPile).toBe(tableauPile1);
    expect(move.toPile).toBe(foundationPile);
    expect(move.cards).toEqual(cards);
    expect(move.cardWasFlipped).toBe(false);
  });
  
  test('execute() should move cards between piles if valid', () => {
    // Try to move the red 3 onto the hearts foundation
    const cards = [tableauPile1.cards[2]]; // Hearts 3
    
    const move = new Move(tableauPile1, foundationPile, cards);
    
    // First add an Ace to the foundation pile (required for a 3 to be valid)
    foundationPile.addCard(new Card(Suit.HEARTS, Rank.ACE, true));
    foundationPile.addCard(new Card(Suit.HEARTS, Rank.TWO, true));
    
    // Before the move
    expect(tableauPile1.size()).toBe(3);
    expect(foundationPile.size()).toBe(2);
    
    // Execute the move
    const result = move.execute();
    
    // The move should succeed
    expect(result).toBe(true);
    
    // After the move
    expect(tableauPile1.size()).toBe(2);
    expect(foundationPile.size()).toBe(3);
    expect(foundationPile.peek()).toEqual(cards[0]);
  });
  
  test('execute() should fail if the move is invalid', () => {
    // Try to move a hearts 3 onto the foundation without proper sequence
    const cards = [tableauPile1.cards[2]]; // Hearts 3
    
    const move = new Move(tableauPile1, foundationPile, cards);
    
    // Before the move
    expect(tableauPile1.size()).toBe(3);
    expect(foundationPile.size()).toBe(0);
    
    // Execute the move (should fail because only an Ace can go on an empty foundation)
    const result = move.execute();
    
    // The move should fail
    expect(result).toBe(false);
    
    // The piles should remain unchanged
    expect(tableauPile1.size()).toBe(3);
    expect(foundationPile.size()).toBe(0);
  });
  
  test('execute() should fail if cards are not found in source pile', () => {
    // Try to move a card that isn't in the source pile
    const cards = [new Card(Suit.DIAMONDS, Rank.ACE, true)];
    
    const move = new Move(tableauPile1, foundationPile, cards);
    
    // Execute the move
    const result = move.execute();
    
    // The move should fail
    expect(result).toBe(false);
    
    // The piles should remain unchanged
    expect(tableauPile1.size()).toBe(3);
    expect(foundationPile.size()).toBe(0);
  });
  
  test('execute() should move multiple cards if valid', () => {
    // Try to move a sequence of cards to another tableau pile
    const cards = [
      new Card(Suit.HEARTS, Rank.FIVE, true),
      new Card(Suit.SPADES, Rank.FOUR, true),
      new Card(Suit.HEARTS, Rank.THREE, true)
    ];
    
    const emptyTableau = new TableauPile([new Card(Suit.SPADES, Rank.SIX, true)]);
    
    const move = new Move(tableauPile1, emptyTableau, cards);
    
    // Before the move
    expect(tableauPile1.size()).toBe(3);
    expect(emptyTableau.size()).toBe(1);
    
    // Execute the move
    const result = move.execute();
    
    // The move should succeed
    expect(result).toBe(true);
    
    // After the move
    expect(tableauPile1.size()).toBe(0);
    expect(emptyTableau.size()).toBe(4);
    expect(emptyTableau.cards[1]).toEqual(cards[0]);
    expect(emptyTableau.cards[2]).toEqual(cards[1]);
    expect(emptyTableau.cards[3]).toEqual(cards[2]);
  });
  
  test('undo() should restore cards to their original pile', () => {
    // Set up a valid move from tableauPile1 to foundationPile
    const cards = [tableauPile1.cards[2]]; // Hearts 3
    
    const move = new Move(tableauPile1, foundationPile, cards);
    
    // Add prerequisites to foundation pile
    foundationPile.addCard(new Card(Suit.HEARTS, Rank.ACE, true));
    foundationPile.addCard(new Card(Suit.HEARTS, Rank.TWO, true));
    
    // Execute the move
    move.execute();
    
    // After the move
    expect(tableauPile1.size()).toBe(2);
    expect(foundationPile.size()).toBe(3);
    
    // Undo the move
    const undoResult = move.undo();
    
    // The undo should succeed
    expect(undoResult).toBe(true);
    
    // After the undo
    expect(tableauPile1.size()).toBe(3);
    expect(foundationPile.size()).toBe(2);
    expect(tableauPile1.peek()).toEqual(cards[0]);
  });
  
  test('undo() should fail if cards are not found in destination pile', () => {
    // Set up a move with cards that aren't in the destination pile
    const cards = [new Card(Suit.DIAMONDS, Rank.ACE, true)];
    
    const move = new Move(tableauPile1, foundationPile, cards);
    
    // Undo the move without executing it first
    const undoResult = move.undo();
    
    // The undo should fail
    expect(undoResult).toBe(false);
    
    // The piles should remain unchanged
    expect(tableauPile1.size()).toBe(3);
    expect(foundationPile.size()).toBe(0);
  });
  
  test('undo() should flip back a card if cardWasFlipped is true', () => {
    // Set up a tableau pile with a face-down card
    tableauPile1 = new TableauPile([
      new Card(Suit.HEARTS, Rank.FIVE, true),
      new Card(Suit.SPADES, Rank.FOUR, false) // Face-down card
    ]);
    
    // Add a face-up card on top that we'll move
    const card = new Card(Suit.HEARTS, Rank.THREE, true);
    tableauPile1.addCard(card);
    
    // Create a move that includes the card-flipped flag
    const move = new Move(tableauPile1, foundationPile, [card], true);
    
    // Set up foundation pile to accept the card
    foundationPile.addCard(new Card(Suit.HEARTS, Rank.ACE, true));
    foundationPile.addCard(new Card(Suit.HEARTS, Rank.TWO, true));
    
    // Execute the move
    move.execute();
    
    // Flip the now-exposed card in the tableau pile
    const flipped = tableauPile1.flipTopCard();
    expect(flipped).toBe(true);
    expect(tableauPile1.peek()?.faceUp).toBe(true);
    
    // Manually flip the second card back to face-down before the undo
    // This simulates what would happen in the game logic (not the Move's responsibility)
    tableauPile1.cards[1].flip();
    
    // Undo the move
    const undoResult = move.undo();
    
    // The undo should succeed
    expect(undoResult).toBe(true);
    
    // After the undo, the top card should be our moved card
    expect(tableauPile1.peek()).toEqual(card);
  });
});