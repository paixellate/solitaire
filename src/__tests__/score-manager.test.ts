import { expect, test, describe } from 'vitest';
import { ScoreManager } from '../score-manager';

describe('ScoreManager', () => {
  test('should initialize with zero score', () => {
    const scoreManager = new ScoreManager();
    expect(scoreManager.getScore()).toBe(0);
  });
  
  test('waste_to_tableau() should increase score by 5', () => {
    const scoreManager = new ScoreManager();
    scoreManager.waste_to_tableau();
    expect(scoreManager.getScore()).toBe(5);
  });
  
  test('waste_to_foundation() should increase score by 10', () => {
    const scoreManager = new ScoreManager();
    scoreManager.waste_to_foundation();
    expect(scoreManager.getScore()).toBe(10);
  });
  
  test('tableau_to_foundation() should increase score by 10', () => {
    const scoreManager = new ScoreManager();
    scoreManager.tableau_to_foundation();
    expect(scoreManager.getScore()).toBe(10);
  });
  
  test('turn_over_tableau_card() should increase score by 5', () => {
    const scoreManager = new ScoreManager();
    scoreManager.turn_over_tableau_card();
    expect(scoreManager.getScore()).toBe(5);
  });
  
  test('foundation_to_tableau() should decrease score by 15', () => {
    const scoreManager = new ScoreManager();
    scoreManager.foundation_to_tableau();
    expect(scoreManager.getScore()).toBe(-15);
  });
  
  test('recycle_waste() should decrease score by 100', () => {
    const scoreManager = new ScoreManager();
    scoreManager.recycle_waste();
    expect(scoreManager.getScore()).toBe(-100);
  });
  
  test('should accumulate score correctly', () => {
    const scoreManager = new ScoreManager();
    
    scoreManager.waste_to_tableau();       // +5
    scoreManager.tableau_to_foundation();  // +10
    scoreManager.waste_to_foundation();    // +10
    scoreManager.foundation_to_tableau();  // -15
    scoreManager.turn_over_tableau_card(); // +5
    
    expect(scoreManager.getScore()).toBe(15);
  });
});