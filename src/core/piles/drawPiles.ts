import { Card } from "../card";
import { Rank } from "../rank";
import { Suit } from "../suit";
import { Pile } from "./pile";
import { PileType } from "./pileType";
import * as THREE from "three";

export class DrawPiles {
    private readonly stockPile: Pile;
    private readonly wastePile: Pile;

    constructor(
        stockIndex: number,
        wasteIndex: number,
        width: number,
        height: number,
        position: { x: number; y: number; z: number },
        wasteOffset: { x: number; y: number }
    ) {
        this.stockPile = new Pile(stockIndex, PileType.STOCK, width, height, position);
        this.wastePile = new Pile(wasteIndex, PileType.WASTE, width, height, {
            x: position.x + wasteOffset.x,
            y: position.y + wasteOffset.y,
            z: position.z,
        });
        this.addDeckToStock();
    }

    private addDeckToStock(): void {
        for (const suit of Object.values(Suit)) {
            for (const rank of Object.values(Rank)) {
                this.addCardToStock(new Card(rank, suit, 100, 140, { x: 0, y: 0, z: 0 }));
            }
        }
    }

    public addToScene(scene: THREE.Scene): void {
        this.stockPile.addToScene(scene);
        this.wastePile.addToScene(scene);
    }

    public canAddCard(card: Card): boolean {
        return false;
    }

    public addCard(card: Card): void {
        this.addCardToStock(card);
    }

    private addCardToStock(card: Card): void {
        this.stockPile.addCard(card, { x: 0, y: 0 });
    }

    private addCardToWaste(card: Card): void {
        this.wastePile.addCard(card, { x: 0, y: 0 });
    }

    private revealCard(): boolean {
        const topCard = this.stockPile.popCard();
        if (topCard) {
            topCard.makeFaceUp();
            this.addCardToWaste(topCard);
            return true;
        }
        return false;
    }

    public dealCard(): void {
        const revealed = this.revealCard();
        if (revealed) {
            return;
        }

        if (this.wastePile.canPopCard()) {
            while (this.wastePile.canPopCard()) {
                this.addCardToStock(this.wastePile.popCardOrThrow());
            }
            this.revealCard();
        } else {
            // do nothing
        }
    }

    public dealCardForSetup(): Card {
        return this.stockPile.popCardOrThrow();
    }
}
