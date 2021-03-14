import { IconButton, Tooltip } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { SHORTCUT_KEY_PRESS_EVENT } from '../../constants';
import { useIsScreenSmallContext } from '../../contexts/ScreenSmallContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import {
	ShortcutKeyPressEventDetail,
	ToolBarBtnTemplate,
	Tools,
} from '../../types';
import './ToolBarButton.css';

interface Props {
	currentTool: Tools;
	toolBarBtn: ToolBarBtnTemplate;
	onClick: (tool: Tools) => void;
}

function ToolBarButton({ currentTool, toolBarBtn, onClick }: Props) {
	const { icon, isSelectable, title, tool, shortcut, disabled } = toolBarBtn;
	const isSelected = tool === currentTool && isSelectable;
	const { theme } = useThemeContext();
	const isScreenSmall = useIsScreenSmallContext();
	const handleShortcutKeyPress = useCallback(
		(e: CustomEvent<ShortcutKeyPressEventDetail>) => {
			if (e.detail.tool === tool) onClick(tool);
		},
		[onClick, tool]
	) as EventListener;
	const getTitleWithShortcut = (title: string): string => {
		if (!shortcut) return title;
		const { isCtrl, isShift } = shortcut;
		const key = shortcut.key.toUpperCase();
		if (isCtrl && isShift) return `${title} (Ctrl + Shift + ${key})`;
		else if (isCtrl) return `${title} (Ctrl + ${key})`;
		else if (isShift) return `${title} (Shift + ${key})`;
		else if (key) return `${title} (${key})`;
		return title;
	};
	useEffect(() => {
		window.addEventListener(SHORTCUT_KEY_PRESS_EVENT, handleShortcutKeyPress);
		return () => {
			window.removeEventListener(
				SHORTCUT_KEY_PRESS_EVENT,
				handleShortcutKeyPress
			);
		};
	}, [handleShortcutKeyPress]);
	const classes = `tool-bar-btn ${isSelected ? 'selected' : ''} ${theme} ${
		isScreenSmall ? 'small-screen' : ''
	} ${disabled ? 'disabled' : ''}`;

	return (
		<div className={classes}>
			<Tooltip title={getTitleWithShortcut(title)} arrow>
				<span>
					<IconButton onClick={() => onClick(tool)} disabled={disabled}>
						{icon}
					</IconButton>
				</span>
			</Tooltip>
		</div>
	);
}

export default ToolBarButton;
