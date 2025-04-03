import { Pile } from "./pile";
import { vec2, vec3 } from "../../vector";
import { Selections } from "../rules/selection";

export class SelectionPile extends Pile {
    private initialMousePosition: vec2 | null = null;
    private mousePositionOffset: vec2 | null = null;

    constructor(index: number, width: number, height: number, position: vec3, offsetFaceUp: vec2, offsetFaceDown: vec2) {
        super(index, width, height, position, offsetFaceUp, offsetFaceDown);
    }

    public setSelectionCardPosition(mousePosition: vec2, position: vec3): void {
        this.initialMousePosition = mousePosition.clone();
        this.mousePositionOffset = vec2(position.x - mousePosition.x, position.y - mousePosition.y);
        this.setLocalPosition(vec3(position.x, position.y, 100));
    }

    public moveWithCursor(mousePosition: vec2): void {
        if (this.initialMousePosition && this.mousePositionOffset) {
            this.setLocalPosition(vec3(mousePosition.x + this.mousePositionOffset.x, mousePosition.y + this.mousePositionOffset.y, 100));
        }
    }

    public setSelection(selection: Selections | null): void {
        if (selection) {
            this.addCards(selection.cards);
            this.setSelectionCardPosition(selection.mousePosition, selection.cardPosition);
        }
    }

    public reset(): void {
        this.popAllCards();
        this.initialMousePosition = null;
        this.mousePositionOffset = null;
        this.setLocalPosition(vec3(0, 0, -10000));
    }
}
