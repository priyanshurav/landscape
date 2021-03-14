const hexToUint32 = (hex: string): number => {
	return parseInt(hex.replace('#', '0x'), 16);
};

const bucketFill = (
	ctx: CanvasRenderingContext2D,
	currentColor: string,
	startX: number,
	startY: number
) => {
	const width = ctx.canvas.width;
	const height = ctx.canvas.height;
	const imageData = ctx.getImageData(0, 0, width, height);
	const imageDataWidth = imageData.width;
	const view = new DataView(imageData.data.buffer);
	const fillStack: number[] = [];
	fillStack.push(startX, startY);
	const byteOffset = (startY * imageDataWidth + startX) * 4;
	const targetColor = view.getUint32(byteOffset);
	const currentColorInUint32 = hexToUint32(`${currentColor}ff`.toLowerCase());
	if (targetColor === currentColorInUint32) return;
	ctx.fillStyle = currentColor;
	while (fillStack.length > 0) {
		const y = fillStack.pop() as number;
		const x = fillStack.pop() as number;
		if (x < 0 || y < 0 || x > width || y > height) continue;
		const byteOffset = (y * imageDataWidth + x) * 4;
		if (byteOffset < 0 || byteOffset >= view.byteLength) continue;
		const currentColor = view.getUint32(byteOffset);
		if (currentColor !== targetColor) continue;
		ctx.fillRect(x, y, 1, 1);
		view.setUint32(byteOffset, currentColorInUint32);
		fillStack.push(x, y + 1);
		fillStack.push(x + 1, y);
		fillStack.push(x - 1, y);
		fillStack.push(x, y - 1);
	}
};

export default bucketFill;
