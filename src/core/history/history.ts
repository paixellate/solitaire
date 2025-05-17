import { Move } from "./move";

export class History {
    private readonly seed: number;
    private readonly moves: Move[];

    constructor(seed: number) {
        this.seed = seed;
        this.moves = [];
    }

    public getSeed(): number {
        return this.seed;
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

    public clear(): void {
        while (this.moves.length > 0) {
            this.moves.pop();
        }
    }
}
