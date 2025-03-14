export class ScoreManager {
  // Properties
  private _score: number;
  
  // Constructor
  constructor() {
    this._score = 0;
  }
  
  // Methods
  waste_to_tableau(): void {
    this._score += 5;
  }
  
  waste_to_foundation(): void {
    this._score += 10;
  }
  
  tableau_to_foundation(): void {
    this._score += 10;
  }
  
  turn_over_tableau_card(): void {
    this._score += 5;
  }
  
  foundation_to_tableau(): void {
    this._score -= 15;
  }
  
  recycle_waste(): void {
    this._score -= 100;
  }
  
  getScore(): number {
    return this._score;
  }
}