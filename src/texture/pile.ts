export function createPileTexture(symbol: string, backgroundColor: string, symbolColor: string, width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;

    const borderWidth = 1;

    // Draw white background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // // Draw border
    ctx.strokeStyle = "#333";
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);

    // Draw big symbol in center
    ctx.font = `bold 72px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = symbolColor;
    ctx.fillText(symbol, width / 2, height / 2);

    return canvas.toDataURL("image/png");
}
