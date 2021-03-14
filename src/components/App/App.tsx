import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	BUTTON_OPACITY,
	DEFAULT_CURRENT_COLOR,
	ERASER_RECT_STROKE_WIDTH,
	MAX_UNDO_REDO_STACK_LENGTH,
	SIDE_BAR_SIZE,
} from '../../constants';
import { CanvasSize, Coords, Tools } from '../../types';
import ChangeCurrentColorDialog from '../ChangeCurrentColorDialog/ChangeCurrentColorDialog';
import SideBar from '../SideBar/SideBar';
import getToolBarBtnsTemplate from '../../getToolBarBtnsTemplate';
import CreditsDialog from '../CreditsDialog/CreditsDialog';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useIsScreenSmallContext } from '../../contexts/ScreenSmallContext';
import getCanvasSize from './getCanvasSize';
import bucketFill from './bucketFill';
import OpenImageDialog from '../OpenImageDialog/OpenImageDialog';
import { blue } from '@material-ui/core/colors';
import './App.css';
import SettingsDialog from '../SettingsDialog/SettingsDialog';
import getDefaultPenSize from '../../getDefaultPenSize';
import dispatchShortcutKeyPressEvent from '../../eventDispatchers/dispatchShortcutKeyPressEvent';
import dispatchColorChangeEvent from '../../eventDispatchers/dispatchColorChangeEvent';

let startX = 0;
let startY = 0;
let isDrawing = false;

// This variable represents the index of the imageData currently applied on the canvas in the DOM.
let currentUndoRedoStackIndex = 0;
let undoRedoStack: ImageData[] = [];

// This canvas is used to store the previous state of the canvas that is in the DOM, so
// that we can delete the previously drawn shape until the finished drawing the shape.
const inMemCanvas = document.createElement('canvas');

const inMemCanvasCtx = inMemCanvas.getContext('2d') as CanvasRenderingContext2D;

// The context of the canvas in the DOM.
let ctx: CanvasRenderingContext2D;

function App() {
	const [currentTool, setCurrentTool] = useState<Tools>(Tools.PENCIL);
	const isScreenSmall = useIsScreenSmallContext();
	const [penSize, setPenSize] = useState(getDefaultPenSize);
	const [currentColor, setCurrentColor] = useState(DEFAULT_CURRENT_COLOR);
	const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false);
	const [isOpenImageDialogOpen, setIsOpenImageDialogOpen] = useState(false);
	const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
	const { theme, setTheme } = useThemeContext();
	const muiTheme = createMuiTheme({ palette: { primary: blue, type: theme } });
	// prettier-ignore
	const [isCurrentColorDialogOpen, setIsCurrentColorDialogOpen] = useState(false);
	const [isRedoDisabled, setIsRedoDisabled] = useState(true);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [canvasSize, setCanvasSize] = useState<CanvasSize>(getCanvasSize);

	const eraseFullCanvas = (ctx: CanvasRenderingContext2D) => {
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	};
	const saveCanvasToInMemCanvas = useCallback(() => {
		eraseFullCanvas(inMemCanvasCtx);
		inMemCanvasCtx.drawImage(canvasRef.current as HTMLCanvasElement, 0, 0);
	}, []);
	const saveCanvasToUndoRedoStack = useCallback(() => {
		if (undoRedoStack.length === MAX_UNDO_REDO_STACK_LENGTH)
			undoRedoStack.shift();
		const canvas = canvasRef.current as HTMLCanvasElement;
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		currentUndoRedoStackIndex = undoRedoStack.push(imageData) - 1;
	}, []);
	const undo = useCallback(() => {
		const nextImageData = undoRedoStack[currentUndoRedoStackIndex - 1];
		if (!nextImageData) return;
		eraseFullCanvas(ctx);
		ctx.putImageData(nextImageData, 0, 0);
		if (isRedoDisabled) setIsRedoDisabled(false);
		currentUndoRedoStackIndex--;
		saveCanvasToInMemCanvas();
	}, [saveCanvasToInMemCanvas, isRedoDisabled]);
	const redo = useCallback(() => {
		if (isRedoDisabled) return;
		const nextImageData = undoRedoStack[currentUndoRedoStackIndex + 1];
		if (!nextImageData) return;
		eraseFullCanvas(ctx);
		ctx.putImageData(nextImageData, 0, 0);
		currentUndoRedoStackIndex++;
		saveCanvasToInMemCanvas();
	}, [saveCanvasToInMemCanvas, isRedoDisabled]);
	const saveImage = () => {
		const downloadAnchorEl = document.createElement('a');
		downloadAnchorEl.download = 'Untitled.png';
		const canvasImageInBase64 = (canvasRef.current as HTMLCanvasElement)
			.toDataURL()
			.replace('image/png', 'image/octet-stream');
		downloadAnchorEl.href = canvasImageInBase64;
		downloadAnchorEl.click();
	};
	const toolBarBtns = useMemo(
		() =>
			getToolBarBtnsTemplate({
				theme,
				setTheme,
				setIsCurrentColorDialogOpen,
				setIsCreditDialogOpen,
				setIsOpenImageDialogOpen,
				setIsSettingsDialogOpen,
				undo,
				redo,
				saveImage,
				isRedoDisabled,
			}),
		[redo, setTheme, theme, undo, isRedoDisabled]
	);
	const getCoords = (event: MouseEvent | TouchEvent): Coords => {
		const offsetX = canvasRef.current?.offsetLeft as number;
		const offsetY = canvasRef.current?.offsetTop as number;
		if (event instanceof MouseEvent) {
			return {
				x: event.clientX - offsetX,
				y: event.clientY - offsetY,
			};
		} else if (event instanceof TouchEvent) {
			return {
				x: event.changedTouches[0].clientX - offsetX,
				y: event.changedTouches[0].clientY - offsetY,
			};
		}
		return { x: 0, y: 0 };
	};
	const handleResize = useCallback(() => {
		saveCanvasToInMemCanvas();
		setCanvasSize(getCanvasSize());
	}, [saveCanvasToInMemCanvas]);

	const erase = useCallback((x: number, y: number): void => {
		if (!isDrawing) return;
		const width = x - startX;
		const height = y - startY;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(
			// prettier-ignore
			x < startX ? x - ERASER_RECT_STROKE_WIDTH : startX - ERASER_RECT_STROKE_WIDTH,
			// prettier-ignore
			y < startY ? y - ERASER_RECT_STROKE_WIDTH : startY - ERASER_RECT_STROKE_WIDTH,
			Math.abs(width) + ERASER_RECT_STROKE_WIDTH * 2,
			Math.abs(height) + ERASER_RECT_STROKE_WIDTH * 2
		);
	}, []);

	const drawLine = useCallback(
		(x: number, y: number): void => {
			ctx.lineCap = 'round';
			ctx.lineWidth = penSize;
			ctx.strokeStyle = currentColor;
			ctx.lineTo(x, y);
			ctx.stroke();
		},
		[penSize, currentColor]
	);

	const applyInMemCanvasImage = useCallback((): void => {
		eraseFullCanvas(ctx);
		ctx.drawImage(inMemCanvas, 0, 0);
	}, []);

	const endDraw = useCallback(
		(e: MouseEvent | TouchEvent): void => {
			const { x, y } = getCoords(e);
			if (currentTool === Tools.ERASER) erase(x, y);
			startX = 0;
			startY = 0;
			if (currentTool === Tools.PENCIL) ctx.closePath();
			saveCanvasToInMemCanvas();
			if (!isDrawing) {
				isDrawing = false;
				return;
			}
			if (!isRedoDisabled) {
				setIsRedoDisabled(true);
				undoRedoStack = undoRedoStack.slice(0, currentUndoRedoStackIndex + 1);
			}
			isDrawing = false;
			saveCanvasToUndoRedoStack();
		},
		[
			currentTool,
			erase,
			saveCanvasToUndoRedoStack,
			saveCanvasToInMemCanvas,
			isRedoDisabled,
		]
	);
	const drawRect = (x: number, y: number) => {
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.rect(startX, startY, x - startX, y - startY);
		ctx.stroke();
		ctx.closePath();
	};
	const draw = useCallback(
		(e: MouseEvent | TouchEvent): void => {
			if (!isDrawing || !ctx) return;
			const { x, y } = getCoords(e);
			ctx.lineWidth = penSize;
			ctx.strokeStyle = currentColor;
			switch (currentTool) {
				case Tools.RECTANGLE:
					applyInMemCanvasImage();
					drawRect(x, y);
					break;
				case Tools.CIRCLE:
					applyInMemCanvasImage();
					ctx.beginPath();
					ctx.arc(startX, startY, Math.abs(x - startX), 0, Math.PI * 2, false);
					ctx.stroke();
					ctx.closePath();
					break;
				case Tools.PENCIL:
					drawLine(x, y);
					break;
				case Tools.ERASER:
					applyInMemCanvasImage();
					ctx.strokeStyle = 'red';
					ctx.lineWidth = ERASER_RECT_STROKE_WIDTH;
					drawRect(x, y);
					break;
			}
		},
		[applyInMemCanvasImage, currentTool, drawLine, penSize, currentColor]
	);
	const beginDraw = (e: MouseEvent | TouchEvent): void => {
		if (isDrawing) return;
		const { x, y } = getCoords(e);
		startX = x;
		startY = y;
		if (currentTool === Tools.PENCIL) ctx.beginPath();
		if (currentTool !== Tools.COLOR_PICKER) isDrawing = true;
		draw(e);
	};
	const handleCanvasClick = (e: MouseEvent) => {
		const { x, y } = getCoords(e);
		if (currentTool === Tools.BUCKET_FILL) {
			bucketFill(ctx, currentColor, x, y);
		} else if (currentTool === Tools.COLOR_PICKER) {
			const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
			const color = `rgb(${r}, ${g}, ${b})`;
			setCurrentColor(color);
			dispatchColorChangeEvent(color);
		}
	};

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.repeat || e.metaKey || e.altKey) return;
			const tools = toolBarBtns.filter(({ shortcut }) => {
				if (!shortcut) return false;
				const { isCtrl, isShift, key } = shortcut;
				const isChosenKeyPressed =
					key.toUpperCase() === e.key.toUpperCase() ||
					key.toLowerCase() === e.key.toLowerCase();
				// prettier-ignore
				const isOnlyChosenKeyPressed =
					isChosenKeyPressed && !e.shiftKey && !isShift && !e.ctrlKey && !isCtrl;
				const isOnlyCtrlAndChosenKeyPressed =
					isCtrl && e.ctrlKey && !isShift && !e.shiftKey && isChosenKeyPressed;
				const isOnlyShiftAndChosenKeyPressed =
					isShift && e.shiftKey && !e.ctrlKey && !isCtrl && isChosenKeyPressed;
				const isShiftAndCtrlAndChosenKeyPressed =
					isShift && e.shiftKey && isCtrl && e.ctrlKey && isChosenKeyPressed;

				if (
					isOnlyChosenKeyPressed ||
					isOnlyCtrlAndChosenKeyPressed ||
					isOnlyShiftAndChosenKeyPressed ||
					isShiftAndCtrlAndChosenKeyPressed
				)
					return true;
				return false;
			});
			if (!tools || !tools[0]) return;
			dispatchShortcutKeyPressEvent(tools[0].tool);
		},
		[toolBarBtns]
	);
	useEffect(() => {
		window.addEventListener('resize', handleResize);
		window.addEventListener('mousemove', draw);
		window.addEventListener('touchmove', draw);
		window.addEventListener('mouseup', endDraw);
		window.addEventListener('touchend', endDraw);
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', draw);
			window.removeEventListener('touchmove', draw);
			window.removeEventListener('mouseup', endDraw);
			window.removeEventListener('touchend', endDraw);
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [endDraw, draw, handleResize, handleKeyDown]);
	useEffect(() => {
		ctx = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D;
	}, []);
	useEffect(handleResize, [handleResize]);
	useEffect(() => {
		// Here we are creating a new canvas to store the previous state of the in-mem canvas during resize.
		const tempCanvas = document.createElement('canvas');
		// prettier-ignore
		const tempCanvasCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
		tempCanvas.width = canvasSize.width;
		tempCanvas.height = canvasSize.height;
		eraseFullCanvas(tempCanvasCtx);
		tempCanvasCtx.drawImage(inMemCanvas, 0, 0);
		inMemCanvas.height = canvasSize.height;
		inMemCanvas.width = canvasSize.width;
		inMemCanvasCtx.drawImage(tempCanvas, 0, 0);
	}, [canvasSize]);
	useEffect(applyInMemCanvasImage, [applyInMemCanvasImage, canvasSize]);
	useEffect(() => {
		eraseFullCanvas(ctx);
		eraseFullCanvas(inMemCanvasCtx);
	}, []);
	useEffect(saveCanvasToUndoRedoStack, [saveCanvasToUndoRedoStack]);
	useEffect(() => {
		document.body.style.setProperty(
			'--button-opacity',
			BUTTON_OPACITY.toString()
		);
		document.body.style.setProperty('--side-bar-size', `${SIDE_BAR_SIZE}px`);
		document.body.style.setProperty(
			'--selected-btn-bg',
			theme === 'dark' ? '#ffffff33' : '#00000026'
		);
	}, [theme]);
	return (
		<MuiThemeProvider theme={muiTheme}>
			<div className={`app-container ${isScreenSmall ? 'small-screen' : ''}`}>
				<SideBar
					currentTool={currentTool}
					setCurrentTool={setCurrentTool}
					toolBarBtns={toolBarBtns}
					currentColor={currentColor}
					penSize={penSize}
					setPenSize={setPenSize}
				/>
				<canvas
					ref={canvasRef}
					height={canvasSize.height}
					width={canvasSize.width}
					onMouseDown={(e) => beginDraw(e.nativeEvent)}
					onTouchStart={(e) => beginDraw(e.nativeEvent)}
					onClick={(e) => handleCanvasClick(e.nativeEvent)}
				/>
			</div>
			<ChangeCurrentColorDialog
				open={isCurrentColorDialogOpen}
				onColorSelect={setCurrentColor}
				closeChangeCurrentColorDialog={() => setIsCurrentColorDialogOpen(false)}
			/>
			<OpenImageDialog
				open={isOpenImageDialogOpen}
				ctx={ctx}
				closeDialog={() => setIsOpenImageDialogOpen(false)}
			/>
			<SettingsDialog
				open={isSettingsDialogOpen}
				onClose={() => setIsSettingsDialogOpen(false)}
				setCurrentColor={setCurrentColor}
				setPenSize={setPenSize}
				currentColor={currentColor}
				penSize={penSize}
			/>
			<CreditsDialog
				open={isCreditDialogOpen}
				closeCreditDialog={() => setIsCreditDialogOpen(false)}
			/>
		</MuiThemeProvider>
	);
}

export default App;
