import { vec2, vec3 } from "../graphics/vector";
import { TableauPile } from "./piles/tableauPile";
import { WastePile } from "./piles/wastePile";
import { StockPile } from "./piles/stockPile";
import { FoundationPile } from "./piles/foundationPile";
import * as THREE from "three";
import { Rectangle } from "../graphics/mesh/reactangle";
import { SelectionPile } from "./selection/selectionPile";
import { Move } from "./history/move";
import { Input } from "../input";
import { Selections } from "./selection/selection";
import { History } from "./history/history";
import { Action } from "./controls";
import { Deck } from "./deck";

export class Board extends Rectangle {
    public readonly deck: Deck;
    public readonly wastePile: WastePile;
    public readonly stockPile: StockPile;
    public readonly tableauPiles: TableauPile[];
    public readonly foundationPiles: FoundationPile[];
    public readonly selectionPile: SelectionPile;
    public selection: Selections | null = null;
    public history: History;

    constructor(
        planeGeometry: THREE.PlaneGeometry,
        position: vec3,
        material: THREE.Material,
        deck: Deck,
        wastePile: WastePile,
        stockPile: StockPile,
        tableauPiles: TableauPile[],
        foundationPiles: FoundationPile[],
        selectionPile: SelectionPile,
        history: History
    ) {
        super(planeGeometry, material, material);
        this.setLocalPosition(position);
        this.deck = deck;
        this.wastePile = wastePile;
        this.stockPile = stockPile;
        this.tableauPiles = tableauPiles;
        this.foundationPiles = foundationPiles;
        this.selectionPile = selectionPile;
        this.history = history;
        this.reset();
    }

    private undo(input: Input): void {
        this.dropSelection(input);
        this.history.undo();
    }

    private reset(): void {
        this.wastePile.popAllCards();
        this.stockPile.popAllCards();
        this.tableauPiles.forEach((pile) => pile.popAllCards());
        this.foundationPiles.forEach((pile) => pile.popAllCards());
        this.selectionPile.popAllCards();
        this.selection = null;
        this.history.clear();

        const cards = this.deck.shuffle(this.history.getSeed());
        cards.forEach((card) => card.makeFaceDown());
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < i + 1; j++) {
                this.tableauPiles[i].addCard(cards.pop()!);
            }
        }
        this.stockPile.addCardsReversed(cards.reverse());
        this.tableauPiles.forEach((pile) => pile.getTopCardOrThrow().makeFaceUp());
    }

    private newGame(seed: number): void {
        this.history = new History(seed);
        this.reset();
    }

    private pickUpSelection(input: Input): void {
        if (!this.selection) {
            this.selection = this.createSelection(input.mouse.position);
            this.selectionPile.set(this.selection);
        }
    }

    private moveSelection(input: Input): void {
        if (this.selection) {
            this.selectionPile.moveWithCursor(input.mouse.position);
        }
    }

    private dropSelection(input: Input): void {
        if (this.selection) {
            this.selectionPile.reset();
            const move = this.createMove(this.selection, input.mouse.position);
            this.selection = null;
            if (move.execute()) {
                this.history.addMove(move);
            }
        }
    }

    public update(input: Input, action: Action): void {
        if (action === Action.Undo) {
            this.undo(input);
        } else if (action === Action.Restart) {
            this.reset();
        } else if (action === Action.NewGame) {
            this.newGame(new Date().getTime());
        }

        if (input.mouse.isDown) {
            if (!input.mouse.wasDown) {
                this.pickUpSelection(input);
            } else {
                this.moveSelection(input);
            }
        } else if (input.mouse.wasDown) {
            this.dropSelection(input);
        }
    }

    private createSelection(mousePosition: vec2): Selections | null {
        for (const sourcePile of [this.wastePile, ...this.foundationPiles]) {
            if (sourcePile.getIsMouseOver(mousePosition)) {
                if (sourcePile.isEmpty()) {
                    return null;
                }

                const bounds = sourcePile.getBounds();
                const cardPosition = sourcePile.getTopCardGlobalPosition();
                const card = sourcePile.popCardOrThrow();
                return new Selections([card], mousePosition, cardPosition, sourcePile, bounds);
            }
        }

        // clicking on stock pile might mean selecting from waste pile if the stock pile is empty.
        if (this.stockPile.getIsMouseOver(mousePosition)) {
            if (this.stockPile.isEmpty() && this.wastePile.isEmpty()) {
                return null;
            }

            if (this.stockPile.isEmpty()) {
                const bounds = this.wastePile.getBounds();
                const cardPosition = this.stockPile.getGlobalPosition();
                const cards = this.wastePile.popAllCards();
                return new Selections(cards, mousePosition, cardPosition, this.wastePile, bounds);
            }

            const bounds = this.stockPile.getBounds();
            const cardPosition = this.stockPile.getTopCardGlobalPosition();
            const card = this.stockPile.popCardOrThrow();
            return new Selections([card], mousePosition, cardPosition, this.stockPile, bounds);
        }

        for (const tableauPile of this.tableauPiles) {
            // for tableau pile, we will first find the card that has been clicked, then select all cards till that card.
            if (tableauPile.getIsMouseOver(mousePosition)) {
                if (tableauPile.isEmpty()) {
                    return null;
                }

                const card = tableauPile.getMouseOverCard(mousePosition);
                if (card) {
                    const bounds = tableauPile.getBounds();
                    const cardPosition = card.getGlobalPosition();
                    const cards = tableauPile.popCardsTill(card);
                    return new Selections(cards, mousePosition, cardPosition, tableauPile, bounds);
                }
                return null;
            }
        }

        return null;
    }

    /**
     * Creates a new move based on the selection and the mouse position.
     * Method is executed when user has dragged cards in hand and released the mouse button.
     * If the user double clicks a card, a destination is automatically selected.
     * This method is hard to read because of optimization of the code (probably premature).
     * @param selectedCards - The selection to move.
     * @param mouseReleasePosition - The mouse position.
     * @param board - The board.
     * @returns A new move.
     */
    private createMove(selectedCards: Selections, mouseReleasePosition: vec2): Move {
        const isAuto = selectedCards.isMouseOverSource(mouseReleasePosition);

        // in case the card came from stock pile, it is face down and cannot be moved anywhere other than waste pile.
        // this is the only scenario where we pick up a facedown card. In all other cases, we have a face up card.
        if (selectedCards.isSourceStockPile()) {
            const isDropOverWastePile = isAuto || this.wastePile.getIsMouseOver(mouseReleasePosition);
            if (isDropOverWastePile) {
                return new Move(selectedCards, this.wastePile);
            }
            return new Move(selectedCards, selectedCards.sourcePile);
        }

        // handle the case where we need to move all cards from waste onto stock pile.
        // This case is slightly odd because we click on stock, but the destination is still stock.
        // The createSelection method currently handles popping cards from the waste pile on selection.
        // So if this is an appropriate filp over case, then waste pile will be empty, because
        // all its cards have been moved to selectionPile.
        if (selectedCards.isSourceWastePile()) {
            const isDropOverStockPile = this.stockPile.getIsMouseOver(mouseReleasePosition);
            const isFlipOver = this.stockPile.getIsMouseOver(selectedCards.sourceMousePosition);
            if (isFlipOver) {
                if (isDropOverStockPile) {
                    return new Move(selectedCards, this.stockPile);
                } else {
                    // If we didn't drop over stock pile, then end processing, we can only move them back to the waste pile.
                    // Dropping anywhere else is incorrect.
                    return new Move(selectedCards, selectedCards.sourcePile);
                }
            }
        }

        // handle single card selection cases, except for single cards selected from tableau piles
        if (selectedCards.isSingleCard()) {
            // A single face up card can only be dropped onto the foundation or tableau pile.
            // handle dropping on the foundation pile first. Dropping on the tableau pile case
            // can be combined with dropping multiple cards on a tableau pile and so it is handled
            // outside the isSingleCard() check.
            if (!selectedCards.isSourceFoundationPile()) {
                for (const foundationPile of this.foundationPiles) {
                    if (foundationPile.canAddCard(selectedCards.cards[0])) {
                        const isDropOverFoundationPile = isAuto || foundationPile.getIsMouseOver(mouseReleasePosition);
                        if (isDropOverFoundationPile) {
                            return new Move(selectedCards, foundationPile);
                        }
                    }
                }
            }
        }

        // Handle the case where we have selected multiple cards from a tableau, which can only be dropped on another tableau pile.
        // Also handle the single card case that could not be dropped on the foundation pile.
        for (const tableauPile of this.tableauPiles) {
            if (tableauPile === selectedCards.sourcePile) {
                continue;
            }

            if (tableauPile.canAddCard(selectedCards.getTopCard())) {
                const isDropOverTableauPile = isAuto || tableauPile.getIsMouseOver(mouseReleasePosition);
                if (isDropOverTableauPile) {
                    return new Move(selectedCards, tableauPile);
                }
            }
        }

        // Drop cards on the same pile they were selected from
        return new Move(selectedCards, selectedCards.sourcePile);
    }
}
