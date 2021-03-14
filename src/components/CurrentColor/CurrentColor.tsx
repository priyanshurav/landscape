import { Tooltip } from '@material-ui/core';
import React from 'react';
import { useIsScreenSmallContext } from '../../contexts/ScreenSmallContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import './CurrentColor.css';

interface Props {
	currentColor: string;
}
function CurrentColor({ currentColor }: Props) {
	const isScreenSmall = useIsScreenSmallContext();
	const { theme } = useThemeContext();

	return (
		<Tooltip title="Pen color" arrow>
			<div
				className={`current-color ${
					isScreenSmall ? 'small-screen' : ''
				} ${theme}`}
				style={{ backgroundColor: currentColor }}
			/>
		</Tooltip>
	);
}

export default CurrentColor;
