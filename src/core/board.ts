import { vec2, vec3 } from "../vector";
import { TableauPile } from "./piles/board/tableauPile";
import { SelectionPile } from "./piles/selectionPile";
import { WastePile } from "./piles/board/wastePile";
import { StockPile } from "./piles/board/stockPile";
import { FoundationPile } from "./piles/board/foundationPile";
import { Deck } from "./cards/deck";
import * as THREE from "three";
import { Rectangle } from "../mesh/reactangle";

export class Board extends Rectangle {
    public readonly wastePile: WastePile;
    public readonly stockPile: StockPile;
    public readonly tableauPiles: TableauPile[];
    public readonly foundationPiles: FoundationPile[];

    constructor() {
        super(1200, 800, new THREE.MeshBasicMaterial({ color: 0x006600 }), new THREE.MeshBasicMaterial({ color: 0xf00000 }));
        this.setLocalPosition(vec3(0, 0, -100));
        this.wastePile = this.createWastePile();
        this.stockPile = this.createStockPile(this.wastePile);
        this.tableauPiles = this.createTableauPiles();
        this.foundationPiles = this.createFoundationPiles();
        this.dealCards(this.createDeck(), this.stockPile, this.tableauPiles);

        this.wastePile.addToObject(this);
        this.stockPile.addToObject(this);
        this.tableauPiles.forEach((pile) => pile.addToObject(this));
        this.foundationPiles.forEach((pile) => pile.addToObject(this));
    }

    public createSelectionPile(): SelectionPile {
        return new SelectionPile(0, 100, 140, vec3(0, 0, -10000), vec2(0, -0.2), vec2(0.001, -0.001));
    }

    public createStockPile(wastePile: WastePile): StockPile {
        return new StockPile(1, 100, 140, vec3(450, 300, 0), vec2(0, -0.2), vec2(0.001, -0.001), wastePile);
    }

    public createWastePile(): WastePile {
        return new WastePile(2, 250, 140, vec3(225, 300, 0), vec2(0.001, -0.001), vec2(0.001, -0.001));
    }

    public createTableauPiles(): TableauPile[] {
        return [
            new TableauPile(3, 100, 140, vec3(-450, 100, 0), vec2(0, -0.2), vec2(0, -0.04)),
            new TableauPile(4, 100, 140, vec3(-300, 100, 0), vec2(0, -0.2), vec2(0, -0.04)),
            new TableauPile(5, 100, 140, vec3(-150, 100, 0), vec2(0, -0.2), vec2(0, -0.04)),
            new TableauPile(6, 100, 140, vec3(0, 100, 0), vec2(0, -0.2), vec2(0, -0.04)),
            new TableauPile(7, 100, 140, vec3(150, 100, 0), vec2(0, -0.2), vec2(0, -0.04)),
            new TableauPile(8, 100, 140, vec3(300, 100, 0), vec2(0, -0.2), vec2(0, -0.04)),
            new TableauPile(9, 100, 140, vec3(450, 100, 0), vec2(0, -0.2), vec2(0, -0.04)),
        ];
    }

    public createFoundationPiles(): FoundationPile[] {
        return [
            new FoundationPile(10, 100, 140, vec3(-450, 300, 0), vec2(0.001, -0.001), vec2(0.001, -0.001)),
            new FoundationPile(11, 100, 140, vec3(-300, 300, 0), vec2(0.001, -0.001), vec2(0.001, -0.001)),
            new FoundationPile(12, 100, 140, vec3(-150, 300, 0), vec2(0.001, -0.001), vec2(0.001, -0.001)),
            new FoundationPile(13, 100, 140, vec3(0, 300, 0), vec2(0.001, -0.001), vec2(0.001, -0.001)),
        ];
    }

    public createDeck(): Deck {
        return new Deck(100, 140);
    }

    public dealCards(deck: Deck, stockPile: StockPile, tableauPiles: TableauPile[]): void {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < i + 1; j++) {
                tableauPiles[i].addCard(deck.popOrThrow());
            }
        }
        stockPile.addCardsReversed(deck.popAllCards());

        tableauPiles.forEach((pile) => pile.getTopCardOrThrow().makeFaceUp());
    }
}
