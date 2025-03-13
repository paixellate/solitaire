import { expect, test, describe } from 'vitest';
import { Pile, StockPile, WastePile, FoundationPile, TableauPile } from '../pile';
import { Card } from '../card';
import { Suit, Rank, PileType, Color } from '../types';

// Helper function to create a simple test deck
function createTestDeck(): Card[] {
  const cards: Card[] = [];
  for (const suit of Object.values(Suit)) {
    if (typeof suit === 'string') { // Filter out reverse mappings
      for (let rank = 1; rank <= 13; rank++) {
        cards.push(new Card(suit as Suit, rank as Rank));
      }
    }
  }
  return cards;
}

// Mock implementation of Pile for testing abstract methods
class MockPile extends Pile {
  constructor(cards: Card[] = []) {
    super(PileType.STOCK, cards);
  }
  
  canAddCard(card: Card): boolean {
    return true; // Always allow cards for testing
  }
}

describe('Pile - Base Class', () => {
  test('should create an empty pile', () => {
    const pile = new MockPile();
    expect(pile.cards).toEqual([]);
    expect(pile.type).toBe(PileType.STOCK);
    expect(pile.isEmpty()).toBe(true);
    expect(pile.size()).toBe(0);
  });
  
  test('should create a pile with initial cards', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.TWO)
    ];
    const pile = new MockPile(cards);
    
    expect(pile.cards.length).toBe(2);
    expect(pile.isEmpty()).toBe(false);
    expect(pile.size()).toBe(2);
  });
  
  test('addCard() should add a card if allowed', () => {
    const pile = new MockPile();
    const card = new Card(Suit.HEARTS, Rank.ACE);
    
    expect(pile.addCard(card)).toBe(true);
    expect(pile.size()).toBe(1);
    expect(pile.peek()).toEqual(card);
  });
  
  test('addCards() should add multiple cards if allowed', () => {
    const pile = new MockPile();
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.TWO)
    ];
    
    expect(pile.addCards(cards)).toBe(true);
    expect(pile.size()).toBe(2);
  });
  
  test('removeTop() should remove and return the top card', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.TWO)
    ];
    const pile = new MockPile(cards);
    
    const removedCard = pile.removeTop();
    expect(removedCard).toEqual(cards[1]);
    expect(pile.size()).toBe(1);
  });
  
  test('removeTop() should return undefined for empty pile', () => {
    const pile = new MockPile();
    expect(pile.removeTop()).toBeUndefined();
  });
  
  test('removeCards() should remove and return cards from the given index', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.TWO),
      new Card(Suit.CLUBS, Rank.THREE)
    ];
    const pile = new MockPile(cards);
    
    const removedCards = pile.removeCards(1);
    expect(removedCards).toEqual([cards[1], cards[2]]);
    expect(pile.size()).toBe(1);
  });
  
  test('removeCards() should handle invalid indices', () => {
    const pile = new MockPile([new Card(Suit.HEARTS, Rank.ACE)]);
    
    expect(pile.removeCards(-1)).toEqual([]);
    expect(pile.removeCards(1)).toEqual([]);
    expect(pile.size()).toBe(1);
  });
  
  test('peek() should return the top card without removing it', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.TWO)
    ];
    const pile = new MockPile(cards);
    
    expect(pile.peek()).toEqual(cards[1]);
    expect(pile.size()).toBe(2);
  });
  
  test('peek() should return undefined for empty pile', () => {
    const pile = new MockPile();
    expect(pile.peek()).toBeUndefined();
  });
  
  test('clear() should remove all cards', () => {
    const pile = new MockPile([
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.TWO)
    ]);
    
    pile.clear();
    expect(pile.isEmpty()).toBe(true);
    expect(pile.size()).toBe(0);
  });
});

describe('StockPile', () => {
  test('should create an empty stock pile', () => {
    const pile = new StockPile();
    expect(pile.type).toBe(PileType.STOCK);
    expect(pile.isEmpty()).toBe(true);
  });
  
  test('should create a stock pile with initial cards', () => {
    const cards = createTestDeck();
    const pile = new StockPile(cards);
    
    expect(pile.size()).toBe(52);
  });
  
  test('reset() should replace all cards', () => {
    const pile = new StockPile();
    const cards = createTestDeck();
    
    pile.reset(cards);
    expect(pile.size()).toBe(52);
  });
  
  test('shuffle() should randomize the order of cards', () => {
    const cards = createTestDeck();
    const pile = new StockPile(cards);
    
    // Store original order
    const originalOrder = [...pile.cards];
    
    // Shuffle the pile
    pile.shuffle();
    
    // Check that the cards are the same but in a different order
    expect(pile.size()).toBe(originalOrder.length);
    
    // Check that at least some cards have changed positions
    // This is a probabilistic test, but with 52 cards it's extremely unlikely to fail
    let samePositionCount = 0;
    for (let i = 0; i < pile.cards.length; i++) {
      if (pile.cards[i].equals(originalOrder[i])) {
        samePositionCount++;
      }
    }
    
    expect(samePositionCount).toBeLessThan(pile.cards.length);
  });
  
  test('draw() should remove and return the top card', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.TWO)
    ];
    const pile = new StockPile(cards);
    
    const drawnCard = pile.draw();
    expect(drawnCard).toEqual(cards[1]);
    expect(pile.size()).toBe(1);
  });
  
  test('canAddCard() should always return false', () => {
    const pile = new StockPile();
    const card = new Card(Suit.HEARTS, Rank.ACE);
    
    expect(pile.canAddCard(card)).toBe(false);
  });
});

describe('WastePile', () => {
  test('should create an empty waste pile', () => {
    const pile = new WastePile();
    expect(pile.type).toBe(PileType.WASTE);
    expect(pile.isEmpty()).toBe(true);
  });
  
  test('canAddCard() should always return false', () => {
    const pile = new WastePile();
    const card = new Card(Suit.HEARTS, Rank.ACE);
    
    expect(pile.canAddCard(card)).toBe(false);
  });
  
  test('should allow adding cards directly via override', () => {
    const pile = new WastePile();
    const card = new Card(Suit.HEARTS, Rank.ACE, true);
    
    // Even though canAddCard returns false, we can still add cards directly
    pile.cards.push(card);
    expect(pile.size()).toBe(1);
    expect(pile.peek()).toEqual(card);
  });
});

describe('FoundationPile', () => {
  test('should create an empty foundation pile', () => {
    const pile = new FoundationPile();
    expect(pile.type).toBe(PileType.FOUNDATION);
    expect(pile.isEmpty()).toBe(true);
    expect(pile.suit).toBeNull();
  });
  
  test('should create a foundation pile with a specific suit', () => {
    const pile = new FoundationPile(Suit.HEARTS);
    expect(pile.suit).toBe(Suit.HEARTS);
  });
  
  test('canAddCard() should only allow Aces on empty piles', () => {
    const pile = new FoundationPile();
    
    expect(pile.canAddCard(new Card(Suit.HEARTS, Rank.ACE))).toBe(true);
    expect(pile.canAddCard(new Card(Suit.HEARTS, Rank.TWO))).toBe(false);
    expect(pile.canAddCard(new Card(Suit.HEARTS, Rank.KING))).toBe(false);
  });
  
  test('canAddCard() should enforce suit for suit-specific foundation piles', () => {
    const pile = new FoundationPile(Suit.HEARTS);
    
    expect(pile.canAddCard(new Card(Suit.HEARTS, Rank.ACE))).toBe(true);
    expect(pile.canAddCard(new Card(Suit.DIAMONDS, Rank.ACE))).toBe(false);
  });
  
  test('canAddCard() should enforce consecutive ranks of the same suit', () => {
    const pile = new FoundationPile();
    
    // Add an Ace of Hearts
    pile.addCard(new Card(Suit.HEARTS, Rank.ACE));
    
    // Now test adding various cards
    expect(pile.canAddCard(new Card(Suit.HEARTS, Rank.TWO))).toBe(true);
    expect(pile.canAddCard(new Card(Suit.HEARTS, Rank.THREE))).toBe(false);
    expect(pile.canAddCard(new Card(Suit.DIAMONDS, Rank.TWO))).toBe(false);
  });
  
  test('isComplete() should return true for a complete suit', () => {
    const pile = new FoundationPile(Suit.HEARTS);
    
    for (let rank = 1; rank <= 13; rank++) {
      pile.cards.push(new Card(Suit.HEARTS, rank as Rank, true));
    }
    
    expect(pile.isComplete()).toBe(true);
  });
  
  test('isComplete() should return false for an incomplete suit', () => {
    const pile = new FoundationPile(Suit.HEARTS);
    
    // Add only up to Queen
    for (let rank = 1; rank <= 12; rank++) {
      pile.cards.push(new Card(Suit.HEARTS, rank as Rank, true));
    }
    
    expect(pile.isComplete()).toBe(false);
  });
});

describe('TableauPile', () => {
  test('should create an empty tableau pile', () => {
    const pile = new TableauPile();
    expect(pile.type).toBe(PileType.TABLEAU);
    expect(pile.isEmpty()).toBe(true);
  });
  
  test('should create a tableau pile with initial cards', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.TWO)
    ];
    const pile = new TableauPile(cards);
    
    expect(pile.size()).toBe(2);
  });
  
  test('canAddCard() should only allow Kings on empty piles', () => {
    const pile = new TableauPile();
    
    expect(pile.canAddCard(new Card(Suit.HEARTS, Rank.KING))).toBe(true);
    expect(pile.canAddCard(new Card(Suit.HEARTS, Rank.QUEEN))).toBe(false);
    expect(pile.canAddCard(new Card(Suit.HEARTS, Rank.ACE))).toBe(false);
  });
  
  test('canAddCard() should enforce alternating colors and descending ranks', () => {
    const pile = new TableauPile();
    
    // Add a King of Spades (black)
    pile.addCard(new Card(Suit.SPADES, Rank.KING));
    
    // Now test adding various cards
    expect(pile.canAddCard(new Card(Suit.HEARTS, Rank.QUEEN))).toBe(true);      // Red Queen - valid
    expect(pile.canAddCard(new Card(Suit.DIAMONDS, Rank.QUEEN))).toBe(true);    // Red Queen - valid
    expect(pile.canAddCard(new Card(Suit.CLUBS, Rank.QUEEN))).toBe(false);      // Black Queen - invalid
    expect(pile.canAddCard(new Card(Suit.SPADES, Rank.QUEEN))).toBe(false);     // Black Queen - invalid
    expect(pile.canAddCard(new Card(Suit.HEARTS, Rank.JACK))).toBe(false);      // Wrong rank - invalid
  });
  
  test('canAddCards() should check if the first card can be added', () => {
    const pile = new TableauPile([new Card(Suit.SPADES, Rank.KING)]);
    
    const validCards = [
      new Card(Suit.HEARTS, Rank.QUEEN),
      new Card(Suit.HEARTS, Rank.JACK)
    ];
    
    const invalidCards = [
      new Card(Suit.CLUBS, Rank.QUEEN),
      new Card(Suit.HEARTS, Rank.JACK)
    ];
    
    expect(pile.canAddCards(validCards)).toBe(true);
    expect(pile.canAddCards(invalidCards)).toBe(false);
    expect(pile.canAddCards([])).toBe(false);
  });
  
  test('flipTopCard() should flip a face-down top card', () => {
    const pile = new TableauPile([
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.TWO, false) // Face down
    ]);
    
    expect(pile.flipTopCard()).toBe(true);
    expect(pile.peek()?.faceUp).toBe(true);
  });
  
  test('flipTopCard() should not flip an already face-up card', () => {
    const pile = new TableauPile([
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.TWO, true) // Already face up
    ]);
    
    expect(pile.flipTopCard()).toBe(false);
    expect(pile.peek()?.faceUp).toBe(true);
  });
  
  test('flipTopCard() should handle empty piles', () => {
    const pile = new TableauPile();
    expect(pile.flipTopCard()).toBe(false);
  });
});