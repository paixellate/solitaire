import { Move } from "./rules/move";

export class History {
    private readonly moves: Move[];

    constructor() {
        this.moves = [];
    }

    public addMove(move: Move) {
        this.moves.push(move);
    }
}
