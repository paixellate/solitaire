export enum Suit {
    HEARTS = "♥",
    DIAMONDS = "♦",
    CLUBS = "♣",
    SPADES = "♠",
}

export const SUITS = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];

export function getSuitColor(suit: Suit): "red" | "black" {
    switch (suit) {
        case Suit.HEARTS:
        case Suit.DIAMONDS:
            return "red";
        case Suit.CLUBS:
        case Suit.SPADES:
            return "black";
    }
}

export function isOppositeColor(suit1: Suit, suit2: Suit): boolean {
    return getSuitColor(suit1) !== getSuitColor(suit2);
}
