import { Pile } from "./pile";
import { vec2, vec3 } from "../../vector";

export class StockPile extends Pile {
    constructor(index: number, width: number, height: number, position: vec3, offsetFaceUp: vec2, offsetFaceDown: vec2) {
        super(index, width, height, position, offsetFaceUp, offsetFaceDown);
    }
}
