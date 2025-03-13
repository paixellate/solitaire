import { Card } from './card';
import { PileType, Suit, Rank, Color } from './types';

export abstract class Pile {
  // Properties
  cards: Card[];
  type: PileType;
  
  // Constructor
  constructor(type: PileType, cards: Card[] = []) {
    this.type = type;
    this.cards = [...cards]; // Create a copy of the array
  }
  
  // Methods
  addCard(card: Card): boolean {
    if (this.canAddCard(card)) {
      this.cards.push(card);
      return true;
    }
    return false;
  }
  
  addCards(cards: Card[]): boolean {
    if (this.canAddCards(cards)) {
      this.cards.push(...cards);
      return true;
    }
    return false;
  }
  
  removeTop(): Card | undefined {
    return this.cards.pop();
  }
  
  removeCards(index: number): Card[] {
    if (index < 0 || index >= this.cards.length) {
      return [];
    }
    
    return this.cards.splice(index);
  }
  
  peek(): Card | undefined {
    return this.cards.length > 0 ? this.cards[this.cards.length - 1] : undefined;
  }
  
  isEmpty(): boolean {
    return this.cards.length === 0;
  }
  
  size(): number {
    return this.cards.length;
  }
  
  abstract canAddCard(card: Card): boolean;
  
  canAddCards(cards: Card[]): boolean {
    // Default implementation checks if every card can be added
    return cards.length > 0 && cards.every(card => this.canAddCard(card));
  }
  
  clear(): void {
    this.cards = [];
  }
}

export class StockPile extends Pile {
  constructor(cards: Card[] = []) {
    super(PileType.STOCK, cards);
  }
  
  reset(cards: Card[]): void {
    this.clear();
    this.cards = [...cards];
  }
  
  shuffle(): void {
    // Fisher-Yates shuffle algorithm
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  
  draw(): Card | undefined {
    return this.removeTop();
  }
  
  canAddCard(card: Card): boolean {
    // Stock pile doesn't accept cards directly
    return false;
  }
}

export class WastePile extends Pile {
  constructor() {
    super(PileType.WASTE);
  }
  
  canAddCard(card: Card): boolean {
    // Waste pile doesn't accept cards directly
    return false;
  }
}

export class FoundationPile extends Pile {
  suit: Suit | null;
  
  constructor(suit: Suit | null = null) {
    super(PileType.FOUNDATION);
    this.suit = suit;
  }
  
  canAddCard(card: Card): boolean {
    // First card must be an Ace
    if (this.isEmpty()) {
      return card.rank === Rank.ACE && (this.suit === null || card.suit === this.suit);
    }
    
    const topCard = this.peek()!;
    
    // Cards must be the same suit and consecutive rank
    return card.suit === topCard.suit && card.rank === topCard.rank + 1;
  }
  
  isComplete(): boolean {
    return this.size() === 13 && this.peek()?.rank === Rank.KING;
  }
}

export class TableauPile extends Pile {
  constructor(cards: Card[] = []) {
    super(PileType.TABLEAU, cards);
  }
  
  canAddCard(card: Card): boolean {
    // Only Kings can be placed on empty tableau piles
    if (this.isEmpty()) {
      return card.rank === Rank.KING;
    }
    
    const topCard = this.peek()!;
    
    // Cards must be of opposite color and consecutive rank (descending)
    return card.getColor() !== topCard.getColor() && card.rank === topCard.rank - 1;
  }
  
  canAddCards(cards: Card[]): boolean {
    if (cards.length === 0) {
      return false;
    }
    
    // Check if the first card can be added to this pile
    return this.canAddCard(cards[0]);
  }
  
  flipTopCard(): boolean {
    const topCard = this.peek();
    if (topCard && !topCard.faceUp) {
      topCard.flip();
      return true;
    }
    return false;
  }
}