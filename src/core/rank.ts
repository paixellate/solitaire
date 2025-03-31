export enum Rank {
    ACE = 'A',
    TWO = '2',
    THREE = '3',
    FOUR = '4',
    FIVE = '5',
    SIX = '6',
    SEVEN = '7',
    EIGHT = '8',
    NINE = '9',
    TEN = '10',
    JACK = 'J',
    QUEEN = 'Q',
    KING = 'K'
}

export const RANKS = [
    Rank.ACE, 
    Rank.TWO, 
    Rank.THREE, 
    Rank.FOUR, 
    Rank.FIVE, 
    Rank.SIX, 
    Rank.SEVEN, 
    Rank.EIGHT, 
    Rank.NINE, 
    Rank.TEN, 
    Rank.JACK, 
    Rank.QUEEN, 
    Rank.KING
];

export function getRankValue(rank: Rank): number {
    switch (rank) {
        case Rank.ACE: return 1;
        case Rank.TWO: return 2;
        case Rank.THREE: return 3;
        case Rank.FOUR: return 4;
        case Rank.FIVE: return 5;
        case Rank.SIX: return 6;
        case Rank.SEVEN: return 7;
        case Rank.EIGHT: return 8;
        case Rank.NINE: return 9;
        case Rank.TEN: return 10;
        case Rank.JACK: return 11;
        case Rank.QUEEN: return 12;
        case Rank.KING: return 13;
    }
}

export function getRankFromValue(value: number): Rank | undefined {
    switch (value) {
        case 1: return Rank.ACE;
        case 2: return Rank.TWO;
        case 3: return Rank.THREE;
        case 4: return Rank.FOUR;
        case 5: return Rank.FIVE;
        case 6: return Rank.SIX;
        case 7: return Rank.SEVEN;
        case 8: return Rank.EIGHT;
        case 9: return Rank.NINE;
        case 10: return Rank.TEN;
        case 11: return Rank.JACK;
        case 12: return Rank.QUEEN;
        case 13: return Rank.KING;
        default: throw new Error(`Invalid rank value: ${value}`);
    }
}
