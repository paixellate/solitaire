import { Move } from "./rules/move";

export class History {
    private readonly moves: Move[];

    constructor() {
        this.moves = [];
    }

    public getNumberOfMoves(): number {
        return this.moves.length;
    }

    public addMove(move: Move) {
        this.moves.push(move);
    }

    public undo(): void {
        const move = this.moves.pop();
        if (move) {
            move.undo();
        }
    }
}
