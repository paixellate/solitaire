import { vec3 } from "../vector";
import { TableauPile } from "./piles/board/tableauPile";
import { WastePile } from "./piles/board/wastePile";
import { StockPile } from "./piles/board/stockPile";
import { FoundationPile } from "./piles/board/foundationPile";
import * as THREE from "three";
import { Rectangle } from "../mesh/reactangle";
import { SelectionPile } from "./piles/selectionPile";
import { Move } from "./rules/move";
import { Input } from "../input";
import { Selections } from "./rules/selection";
import { History } from "./history";
import { Action } from "./ui/controls";

export class Board extends Rectangle {
    public readonly history: History;
    public readonly wastePile: WastePile;
    public readonly stockPile: StockPile;
    public readonly tableauPiles: TableauPile[];
    public readonly foundationPiles: FoundationPile[];
    public readonly selectionPile: SelectionPile;
    public selection: Selections | null = null;

    constructor(
        planeGeometry: THREE.PlaneGeometry,
        position: vec3,
        history: History,
        material: THREE.Material,
        wastePile: WastePile,
        stockPile: StockPile,
        tableauPiles: TableauPile[],
        foundationPiles: FoundationPile[],
        selectionPile: SelectionPile
    ) {
        super(planeGeometry, material, material);
        this.setLocalPosition(position);
        this.history = history;
        this.wastePile = wastePile;
        this.stockPile = stockPile;
        this.tableauPiles = tableauPiles;
        this.foundationPiles = foundationPiles;
        this.selectionPile = selectionPile;
    }

    private pickUpSelection(input: Input): void {
        if (!this.selection) {
            this.selection = Selections.create(input.mouse.position, this);
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
            const move = Move.create(this.selection, input.mouse.position, this);
            this.selection = null;
            if (move.execute()) {
                this.history.addMove(move);
            }
        }
    }

    public update(input: Input, action: Action): void {
        if (action === Action.Undo) {
            this.dropSelection(input);
            this.history.undo();
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
}
