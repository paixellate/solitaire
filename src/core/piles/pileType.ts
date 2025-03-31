export enum PileType {
    STOCK = "stock", // Draw pile
    WASTE = "waste", // Cards drawn from stock
    FOUNDATION = "foundation", // 4 piles where cards build up by suit (A to K)
    TABLEAU = "tableau", // 7 columns where cards build down alternating colors
    DRAW = "draw", // Draw pile
}
