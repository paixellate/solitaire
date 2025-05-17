export function createButtonTexture(text: string, backgroundColor: string, textColor: string, width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;

    const borderWidth = 1;

    // Draw dark background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // // Draw border
    ctx.strokeStyle = "#888";
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);

    // // Set text properties
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold 24px Arial`;

    // Draw rank and suit in top left
    ctx.fillText(text, width / 2, height / 2);

    return canvas.toDataURL("image/png");
}
