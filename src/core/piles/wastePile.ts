import { Pile } from "./pile";
import { vec2, vec3 } from "../../vector";
import { Selections } from "../rules/selection";

export class WastePile extends Pile {
    constructor(index: number, width: number, height: number, position: vec3, offsetFaceUp: vec2, offsetFaceDown: vec2) {
        super(index, width, height, position, offsetFaceUp, offsetFaceDown);
    }

    public popSelectedCards(mousePosition: vec2): Selections | null {
        if (!this.isEmpty()) {
            const cardPosition = this.getTopCardGlobalPosition();
            const card = this.popCardOrThrow();
            return new Selections([card], mousePosition, cardPosition, this);
        }
        return null;
    }
}
