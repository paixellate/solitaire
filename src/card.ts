import { Suit, Rank, Color } from './types';

export class Card {
  // Properties
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
  
  // Constructor
  constructor(suit: Suit, rank: Rank, faceUp: boolean = false) {
    this.suit = suit;
    this.rank = rank;
    this.faceUp = faceUp;
  }
  
  // Methods
  flip(): void {
    this.faceUp = !this.faceUp;
  }
  
  toString(): string {
    const rankNames: Record<number, string> = {
      1: 'A',
      11: 'J',
      12: 'Q',
      13: 'K'
    };
    
    const rankStr = rankNames[this.rank] || this.rank.toString();
    const suitSymbols: Record<string, string> = {
      [Suit.CLUBS]: '♣',
      [Suit.DIAMONDS]: '♦',
      [Suit.HEARTS]: '♥',
      [Suit.SPADES]: '♠'
    };
    
    return `${rankStr}${suitSymbols[this.suit]}`;
  }
  
  equals(other: Card): boolean {
    return this.suit === other.suit && this.rank === other.rank;
  }
  
  getColor(): Color {
    return (this.suit === Suit.HEARTS || this.suit === Suit.DIAMONDS) 
      ? Color.RED 
      : Color.BLACK;
  }
}