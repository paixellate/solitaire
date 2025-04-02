import { Pile } from "./pile";
import { vec2, vec3 } from "../../vector";

export class SelectionPile extends Pile {
    private sourcePile: Pile | null;
    private isASingleCard: boolean;
    private initialMousePosition: vec2 | null = null;
    private mousePositionOffset: vec2 | null = null;

    constructor(index: number, width: number, height: number, position: vec3, offsetFaceUp: vec2, offsetFaceDown: vec2) {
        super(index, width, height, position, offsetFaceUp, offsetFaceDown);
        this.sourcePile = null;
        this.isASingleCard = false;
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

    public setSourcePile(sourcePile: Pile): void {
        this.sourcePile = sourcePile;
    }

    public getSourcePileOrThrow(): Pile {
        if (this.sourcePile === null) {
            throw new Error("Selection pile has no source pile");
        }
        return this.sourcePile;
    }

    public isSingleCard(): boolean {
        return this.isASingleCard;
    }

    public setIsSingleCard(isSingleCard: boolean): void {
        this.isASingleCard = isSingleCard;
    }

    public validateAfterSelection(): void {
        if (this.isASingleCard && this.getNumberOfCards() > 1) {
            throw new Error("Selection pile is supposed to be a single card after selection");
        }
        if (!this.isEmpty() && this.sourcePile === null) {
            throw new Error("Selection pile has no source pile after selection");
        }
    }

    public validateAfterDrop(): void {
        if (!this.isEmpty()) {
            throw new Error("Selection pile is not empty after drop");
        }
    }

    public reset(): void {
        this.sourcePile = null;
        this.isASingleCard = false;
        this.initialMousePosition = null;
        this.mousePositionOffset = null;
    }
}
