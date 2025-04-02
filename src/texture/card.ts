import { getSuitColor, Suit } from "../core/cards/suit";
import { Rank } from "../core/cards/rank";

export const TEXT_OFFSET_MULTIPLIER = 0.04;

export function createCardBackTexture(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;

    const borderWidth = 5;

    // Draw white background
    ctx.fillStyle = "#77f";
    ctx.fillRect(0, 0, width, height);

    // Draw border
    ctx.strokeStyle = "#333";
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);

    return canvas.toDataURL("image/png");
}

export function createCardTexture(rank: Rank, suit: Suit, width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;

    const suitColorMap = {
        Bold: {
            red: "#a00",
            black: "#111",
        },
        Light: {
            red: "#faa",
            black: "#ddd",
        },
    };
    const borderWidth = 1;
    const textOffset = width * TEXT_OFFSET_MULTIPLIER;

    // Draw white background
    ctx.fillStyle = suitColorMap["Light"][getSuitColor(suit)];
    ctx.fillRect(0, 0, width, height);

    // // Draw border
    ctx.strokeStyle = "#333";
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);

    // // Set text properties
    ctx.fillStyle = suitColorMap["Bold"][getSuitColor(suit)];
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = `bold 24px Arial`;

    // Draw rank and suit in top left
    ctx.fillText(rank + suit, textOffset, textOffset);

    // Draw in bottom right (upside down)
    ctx.save();
    ctx.translate(width - textOffset, height - textOffset);
    ctx.rotate(Math.PI);
    ctx.fillText(rank + suit, 0, 0);
    ctx.restore();

    // Draw big symbol in center
    ctx.font = `bold 72px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(suit, width / 2, height / 2);

    return canvas.toDataURL("image/png");
}
