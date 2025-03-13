import { Pile } from './pile';
import { Card } from './card';

export class Move {
  // Properties
  fromPile: Pile;
  toPile: Pile;
  cards: Card[];
  cardWasFlipped: boolean;
  
  // Constructor
  constructor(fromPile: Pile, toPile: Pile, cards: Card[], cardWasFlipped: boolean = false) {
    this.fromPile = fromPile;
    this.toPile = toPile;
    this.cards = [...cards]; // Create a copy of the array
    this.cardWasFlipped = cardWasFlipped;
  }
  
  // Methods
  execute(): boolean {
    // Check if the move is valid
    if (!this.toPile.canAddCards(this.cards)) {
      return false;
    }
    
    // Find the index of the first card in the source pile
    const startIndex = this.fromPile.cards.findIndex(card => 
      card.equals(this.cards[0])
    );
    
    if (startIndex === -1) {
      return false; // Card not found in source pile
    }
    
    // Ensure all cards in the sequence match
    for (let i = 0; i < this.cards.length; i++) {
      if (startIndex + i >= this.fromPile.cards.length || 
          !this.fromPile.cards[startIndex + i].equals(this.cards[i])) {
        return false; // Cards don't match or not enough cards
      }
    }
    
    // Remove the cards from the source pile
    const removedCards = this.fromPile.removeCards(startIndex);
    
    // Add the cards to the destination pile
    const addSuccess = this.toPile.addCards(removedCards);
    
    if (!addSuccess) {
      // If we couldn't add the cards to the destination pile, put them back
      this.fromPile.addCards(removedCards);
      return false;
    }
    
    return true;
  }
  
  undo(): boolean {
    // Check if there are enough cards in the destination pile
    if (this.toPile.cards.length < this.cards.length) {
      return false;
    }
    
    // Ensure the cards are at the end of the destination pile
    const destStartIndex = this.toPile.cards.length - this.cards.length;
    
    // Check that the cards match
    for (let i = 0; i < this.cards.length; i++) {
      if (!this.toPile.cards[destStartIndex + i].equals(this.cards[i])) {
        return false; // Cards don't match
      }
    }
    
    // Remove the cards from the destination pile
    const removedCards = this.toPile.removeCards(destStartIndex);
    
    // Add the cards back to the source pile
    const addSuccess = this.fromPile.addCards(removedCards);
    
    if (!addSuccess) {
      // If we couldn't add the cards back to the source pile, restore them to the destination
      this.toPile.addCards(removedCards);
      return false;
    }
    
    // If a card was flipped as part of this move, flip it back
    if (this.cardWasFlipped && this.fromPile.peek()) {
      const topCard = this.fromPile.peek()!;
      if (topCard.faceUp) {
        topCard.flip();
      }
    }
    
    return true;
  }
}