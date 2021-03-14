import {
	Backdrop,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	rgbToHex,
} from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import { COLOR_CHANGE_EVENT, DEFAULT_CURRENT_COLOR } from '../../constants';
import { ColorChangeEventDetail } from '../../types';

interface Props {
	open: boolean;
	onColorSelect: (color: string) => void;
	closeChangeCurrentColorDialog: () => void;
}

function ChangeCurrentColorDialog({
	open,
	onColorSelect,
	closeChangeCurrentColorDialog,
}: Props) {
	const [colorInputValue, setColorInputValue] = useState(DEFAULT_CURRENT_COLOR);
	const handleColorChange = useCallback(
		(e: CustomEvent<ColorChangeEventDetail>): void => {
			setColorInputValue(rgbToHex(e.detail.color));
		},
		[]
	) as EventListener;
	useEffect(() => {
		window.addEventListener(COLOR_CHANGE_EVENT, handleColorChange);
		return () => {
			window.removeEventListener(COLOR_CHANGE_EVENT, handleColorChange);
		};
	}, [handleColorChange]);
	const handleOkBtnClick = (): void => {
		onColorSelect(`${colorInputValue}`);
		closeChangeCurrentColorDialog();
	};
	return (
		<Backdrop open={open}>
			<Dialog open={open}>
				<DialogTitle>Change current color</DialogTitle>
				<DialogContent>
					<ChromePicker
						disableAlpha
						color={colorInputValue}
						onChange={(color) => setColorInputValue(color.hex)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeChangeCurrentColorDialog}>Cancel</Button>
					<Button onClick={handleOkBtnClick}>OK</Button>
				</DialogActions>
			</Dialog>
		</Backdrop>
	);
}

export default ChangeCurrentColorDialog;
