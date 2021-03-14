import { SIDE_BAR_SIZE, SMALL_SCREEN_THRESHOLD } from '../../constants';
import { CanvasSize } from '../../types';

export default function getCanvasSize(): CanvasSize {
	const isScreenSmall = matchMedia(`(max-width: ${SMALL_SCREEN_THRESHOLD}px)`)
		.matches;
	const pageHeight = document.documentElement.clientHeight;
	const pageWidth = document.documentElement.clientWidth;
	const height = isScreenSmall ? pageHeight - SIDE_BAR_SIZE : pageHeight;
	const width = isScreenSmall ? pageWidth : pageWidth - SIDE_BAR_SIZE;
	return { width, height };
}
