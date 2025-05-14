import { vec2 } from "../../vector";
import { Selections } from "../rules/selection";

export abstract class InteractivePile {
    public abstract popSelectedCards(mousePosition: vec2): Selections | null;
}
