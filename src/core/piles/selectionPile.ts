import { Pile } from "./pile";
import { vec2, vec3 } from "../../vector";
import { Selection, Selections } from "../rules/selection";

export class SelectionPile extends Pile {
    private selection: Selection | Selections | null;
    private initialMousePosition: vec2 | null = null;
    private mousePositionOffset: vec2 | null = null;

    constructor(index: number, width: number, height: number, position: vec3, offsetFaceUp: vec2, offsetFaceDown: vec2) {
        super(index, width, height, position, offsetFaceUp, offsetFaceDown);
        this.selection = null;
    }

    public setSelectionCardPosition(mousePosition: vec2, position: vec3): void {
        this.initialMousePosition = mousePosition.clone();
        this.mousePositionOffset = vec2(position.x - mousePosition.x, position.y - mousePosition.y);
        this.setPosition(vec3(position.x, position.y, 100));
    }

    public moveWithCursor(mousePosition: vec2): void {
        if (this.initialMousePosition && this.mousePositionOffset) {
            this.setPosition(vec3(mousePosition.x + this.mousePositionOffset.x, mousePosition.y + this.mousePositionOffset.y, 100));
        }
    }

    public setSelection(selection: Selection | Selections | null): void {
        this.selection = selection;
        if (this.selection) {
            if (this.selection instanceof Selections) {
                this.addCards(this.selection.cards);
            } else {
                this.addCard(this.selection.card);
            }
            this.setSelectionCardPosition(this.selection.mousePosition, this.selection.cardPosition);
        }
    }

    public getSelection(): Selection | Selections | null {
        return this.selection;
    }

    public reset(): void {
        this.selection = null;
        this.popAllCards();
        this.initialMousePosition = null;
        this.mousePositionOffset = null;
        this.setPosition(vec3(0, 0, -10000));
    }
}
