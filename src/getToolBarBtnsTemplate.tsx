import React from 'react';
import { ToolBarBtnTemplate, Tools } from './types';
import { Theme } from './types';
import { ReactComponent as CircleIcon } from './assets/icons/circle.svg';
import { ReactComponent as RectangleIcon } from './assets/icons/rectangle.svg';
import { ReactComponent as CurrentColorIcon } from './assets/icons/pen-color.svg';
import { ReactComponent as ColorPickerIcon } from './assets/icons/color-picker.svg';
import { ReactComponent as BucketFillIcon } from './assets/icons/bucket-fill.svg';
import { ReactComponent as CreditsIcon } from './assets/icons/credits.svg';
import { ReactComponent as EraserIcon } from './assets/icons/eraser.svg';
import { ReactComponent as SceneryIcon } from './assets/icons/scenery.svg';
import {
	Brightness4 as DarkIcon,
	Brightness7 as LightIcon,
	Create as PencilIcon,
	Redo,
	Save,
	Settings,
	Undo,
} from '@material-ui/icons';

interface Arguments {
	theme: Theme;
	setTheme: React.Dispatch<React.SetStateAction<Theme>>;
	setIsCurrentColorDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsCreditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsOpenImageDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsSettingsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isRedoDisabled: boolean;
	undo: () => void;
	redo: () => void;
	saveImage: () => void;
}

const getToolBarBtnsTemplate = ({
	theme,
	setTheme,
	setIsCurrentColorDialogOpen,
	setIsCreditDialogOpen,
	setIsOpenImageDialogOpen,
	undo,
	redo,
	saveImage,
	isRedoDisabled,
	setIsSettingsDialogOpen,
}: Arguments): ToolBarBtnTemplate[] => {
	return [
		{
			icon: <PencilIcon />,
			isSelectable: true,
			tool: Tools.PENCIL,
			title: 'Pencil',
			shortcut: {
				isCtrl: false,
				isShift: false,
				key: 'P',
			},
		},
		{
			icon: <CircleIcon />,
			isSelectable: true,
			tool: Tools.CIRCLE,
			title: 'Circle',
			shortcut: {
				isCtrl: false,
				isShift: false,
				key: 'C',
			},
		},
		{
			icon: <RectangleIcon />,
			isSelectable: true,
			tool: Tools.RECTANGLE,
			title: 'Rectangle',
			shortcut: {
				isCtrl: false,
				isShift: false,
				key: 'R',
			},
		},
		{
			icon: <BucketFillIcon />,
			isSelectable: true,
			tool: Tools.BUCKET_FILL,
			title: 'Bucket fill',
			shortcut: {
				isCtrl: false,
				isShift: false,
				key: 'F',
			},
		},
		{
			icon: <ColorPickerIcon />,
			isSelectable: true,
			tool: Tools.COLOR_PICKER,
			title: 'Color picker',
			shortcut: {
				isCtrl: false,
				isShift: true,
				key: 'C',
			},
		},
		{
			icon: <EraserIcon />,
			isSelectable: true,
			tool: Tools.ERASER,
			title: 'Eraser',
			shortcut: {
				isCtrl: false,
				isShift: false,
				key: 'E',
			},
		},
		{
			icon: <CurrentColorIcon />,
			isSelectable: false,
			tool: Tools.CHANGE_CURRENT_COLOR,
			title: 'Change current color',
			onClick: () => setIsCurrentColorDialogOpen(true),
			shortcut: {
				isCtrl: false,
				isShift: true,
				key: 'K',
			},
		},
		{
			icon: <SceneryIcon />,
			isSelectable: false,
			tool: Tools.OPEN_IMAGE,
			title: 'Open image',
			onClick: () => setIsOpenImageDialogOpen(true),
			shortcut: {
				isCtrl: false,
				isShift: true,
				key: 'O',
			},
		},
		{
			icon: <Save />,
			isSelectable: false,
			tool: Tools.SAVE_IMAGE,
			title: 'Save image',
			onClick: saveImage,
			shortcut: {
				isCtrl: false,
				isShift: true,
				key: 'S',
			},
		},
		{
			icon: <Undo />,
			isSelectable: false,
			tool: Tools.UNDO,
			title: 'Undo',
			shortcut: {
				isCtrl: true,
				isShift: false,
				key: 'Z',
			},
			onClick: undo,
		},
		{
			icon: <Redo />,
			isSelectable: false,
			tool: Tools.REDO,
			title: 'Redo',
			shortcut: {
				isCtrl: true,
				isShift: false,
				key: 'Y',
			},
			onClick: redo,
			disabled: isRedoDisabled,
		},
		{
			icon: theme === 'dark' ? <DarkIcon /> : <LightIcon />,
			isSelectable: false,
			tool: Tools.TOGGLE_THEME,
			title: 'Toggle theme',
			onClick: () =>
				setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark')),
			shortcut: {
				isCtrl: false,
				isShift: false,
				key: 'T',
			},
		},
		{
			icon: <Settings />,
			isSelectable: false,
			title: 'Settings',
			tool: Tools.SETTINGS,
			onClick: () => setIsSettingsDialogOpen(true),
			shortcut: {
				isCtrl: false,
				isShift: false,
				key: 'S',
			},
		},
		{
			icon: <CreditsIcon />,
			isSelectable: false,
			tool: Tools.CREDITS,
			title: 'Credits',
			onClick: () => setIsCreditDialogOpen(true),
			shortcut: {
				isCtrl: true,
				isShift: true,
				key: 'C',
			},
		},
	];
};

export default getToolBarBtnsTemplate;
