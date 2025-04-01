import { vec3 } from "../vector";
import { TableauPile } from "./piles/tableauPile";
import { SelectionPile } from "./piles/selectionPile";
import { WastePile } from "./piles/wastePile";
import { StockPile } from "./piles/stockPile";
import { FoundationPile } from "./piles/foundationPile";

export class Board {
    public createSelectionPile(): SelectionPile {
        return new SelectionPile(0, 100, 140, vec3(0, 0, -10000));
    }

    public createStockPile(): StockPile {
        return new StockPile(1, 100, 140, vec3(450, 200, -100));
    }

    public createWastePile(): WastePile {
        return new WastePile(2, 250, 140, vec3(225, 200, -100));
    }

    public createTableauPiles(): TableauPile[] {
        return [
            new TableauPile(3, 100, 140, vec3(-450, 0, -100)),
            new TableauPile(4, 100, 140, vec3(-300, 0, -100)),
            new TableauPile(5, 100, 140, vec3(-150, 0, -100)),
            new TableauPile(6, 100, 140, vec3(0, 0, -100)),
            new TableauPile(7, 100, 140, vec3(150, 0, -100)),
            new TableauPile(8, 100, 140, vec3(300, 0, -100)),
            new TableauPile(9, 100, 140, vec3(450, 0, -100)),
        ];
    }

    public createFoundationPiles(): FoundationPile[] {
        return [
            new FoundationPile(10, 100, 140, vec3(-450, 200, -100)),
            new FoundationPile(11, 100, 140, vec3(-300, 200, -100)),
            new FoundationPile(12, 100, 140, vec3(-150, 200, -100)),
            new FoundationPile(13, 100, 140, vec3(0, 200, -100)),
        ];
    }

    public dealCards(stockPile: StockPile, tableauPiles: TableauPile[]): void {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < i + 1; j++) {
                tableauPiles[i].addCardForSetup(stockPile.dealCardForSetup());
            }
        }
        tableauPiles.forEach((pile) => pile.getTopCard()?.makeFaceUp());
    }
}
