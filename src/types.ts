export enum Tools {
	RECTANGLE,
	CIRCLE,
	PENCIL,
	ERASER,
	TOGGLE_THEME,
	CHANGE_CURRENT_COLOR,
	COLOR_PICKER,
	BUCKET_FILL,
	CREDITS,
	OPEN_IMAGE,
	SAVE_IMAGE,
	UNDO,
	REDO,
	SETTINGS,
}
export interface Shortcut {
	isCtrl: boolean;
	isShift: boolean;
	key: string;
}
export interface ToolBarBtnTemplate {
	icon: JSX.Element;
	tool: Tools;
	isSelectable: boolean;
	title: string;
	shortcut?: Shortcut;
	disabled?: boolean;
	onClick?: (tool: Tools) => void;
}
export interface CanvasSize {
	width: number;
	height: number;
}
export interface Photo {
	file: File;
	name: string;
}
export interface SnackbarState {
	message: string;
	open: boolean;
}
export interface Coords {
	x: number;
	y: number;
}
export interface Settings {
	isSaveCurrentColorEnabled: boolean;
	isSavePenSizeEnabled: boolean;
	penSize: number;
	currentColor: string;
}
export interface ColorChangeEventDetail {
	color: string;
}
export interface ShortcutKeyPressEventDetail {
	tool: Tools;
}
export type Theme = 'light' | 'dark';
