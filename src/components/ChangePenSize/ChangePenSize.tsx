import { Button, makeStyles, Tooltip } from '@material-ui/core';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import React from 'react';
import { BUTTON_OPACITY, MAX_PEN_SIZE, MIN_PEN_SIZE } from '../../constants';
import { useIsScreenSmallContext } from '../../contexts/ScreenSmallContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import './ChangePenSize.css';

interface Props {
	setPenSize: React.Dispatch<React.SetStateAction<number>>;
	penSize: number;
}

const useIconsStyles = makeStyles({
	root: (isScreenSmall) => ({
		opacity: BUTTON_OPACITY,
		fontSize: isScreenSmall ? '2rem' : '2.5rem',
		margin: 0,
	}),
});
const useButtonStyles = makeStyles({
	root: (isScreenSmall) => ({
		padding: 0,
		margin: 0,
		// To make the button small, setting its minWidth to 1px will not make it disappear.
		minWidth: isScreenSmall ? '1px' : '',
		minHeight: isScreenSmall ? '100%' : '',
	}),
});
function ChangePenSize({ setPenSize, penSize }: Props) {
	const iconStyles = useIconsStyles();
	const isScreenSmall = useIsScreenSmallContext();
	const buttonStyles = useButtonStyles(isScreenSmall);
	const { theme } = useThemeContext();
	const increasePenSize = (): void => {
		if (penSize === MAX_PEN_SIZE) return;
		setPenSize((prevSize) => prevSize + 1);
	};
	const decreasePenSize = (): void => {
		if (penSize === MIN_PEN_SIZE) return;
		setPenSize((prevSize) => prevSize - 1);
	};
	const changePenSize = (
		e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	): void => {
		const newPenSize = parseInt(e.target.value);
		if (e.target.value === '') setPenSize(0);
		if (isNaN(newPenSize)) return;
		if (newPenSize > MAX_PEN_SIZE || newPenSize < MIN_PEN_SIZE) return;
		setPenSize(newPenSize);
	};
	return (
		<div
			className={`change-pen-size ${theme} ${
				isScreenSmall ? 'small-screen' : ''
			}`}
		>
			<Tooltip title="Increase pen size" arrow>
				<Button classes={buttonStyles} onClick={increasePenSize}>
					<ArrowDropUp classes={iconStyles} />
				</Button>
			</Tooltip>
			<Tooltip title="Change pen size" arrow>
				<input
					value={penSize}
					onChange={changePenSize}
					className="change-pen-size-input"
				/>
			</Tooltip>
			<Tooltip title="Decrease pen size" arrow>
				<Button classes={buttonStyles} onClick={decreasePenSize}>
					<ArrowDropDown classes={iconStyles} />
				</Button>
			</Tooltip>
		</div>
	);
}

export default ChangePenSize;
