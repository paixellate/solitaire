import { expect, test, describe } from 'vitest';
import { Card } from '../card';
import { Suit, Rank, Color } from '../types';

describe('Card', () => {
  test('should create a card with the correct properties', () => {
    const card = new Card(Suit.HEARTS, Rank.ACE);
    
    expect(card.suit).toBe(Suit.HEARTS);
    expect(card.rank).toBe(Rank.ACE);
    expect(card.faceUp).toBe(false);
  });
  
  test('should create a face-up card when specified', () => {
    const card = new Card(Suit.CLUBS, Rank.KING, true);
    
    expect(card.faceUp).toBe(true);
  });
  
  test('flip() should toggle faceUp property', () => {
    const card = new Card(Suit.DIAMONDS, Rank.QUEEN);
    expect(card.faceUp).toBe(false);
    
    card.flip();
    expect(card.faceUp).toBe(true);
    
    card.flip();
    expect(card.faceUp).toBe(false);
  });
  
  test('toString() should return the correct string representation', () => {
    expect(new Card(Suit.HEARTS, Rank.ACE).toString()).toBe('A♥');
    expect(new Card(Suit.CLUBS, Rank.KING).toString()).toBe('K♣');
    expect(new Card(Suit.DIAMONDS, Rank.QUEEN).toString()).toBe('Q♦');
    expect(new Card(Suit.SPADES, Rank.JACK).toString()).toBe('J♠');
    expect(new Card(Suit.HEARTS, Rank.TEN).toString()).toBe('10♥');
    expect(new Card(Suit.CLUBS, Rank.TWO).toString()).toBe('2♣');
  });
  
  test('equals() should correctly compare cards', () => {
    const card1 = new Card(Suit.HEARTS, Rank.ACE);
    const card2 = new Card(Suit.HEARTS, Rank.ACE);
    const card3 = new Card(Suit.SPADES, Rank.ACE);
    const card4 = new Card(Suit.HEARTS, Rank.KING);
    
    expect(card1.equals(card2)).toBe(true);
    expect(card1.equals(card3)).toBe(false);
    expect(card1.equals(card4)).toBe(false);
  });
  
  test('getColor() should return the correct color', () => {
    expect(new Card(Suit.HEARTS, Rank.ACE).getColor()).toBe(Color.RED);
    expect(new Card(Suit.DIAMONDS, Rank.TWO).getColor()).toBe(Color.RED);
    expect(new Card(Suit.CLUBS, Rank.THREE).getColor()).toBe(Color.BLACK);
    expect(new Card(Suit.SPADES, Rank.FOUR).getColor()).toBe(Color.BLACK);
  });
});