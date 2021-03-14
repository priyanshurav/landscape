import {
	Backdrop,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	makeStyles,
	Switch,
	Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import {
	DEFAULT_CURRENT_COLOR,
	LOCAL_STORAGE_SETTINGS_KEY,
} from '../../constants';
import dispatchColorChangeEvent from '../../eventDispatchers/dispatchColorChangeEvent';
import getDefaultPenSize from '../../getDefaultPenSize';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Settings } from '../../types';

const useDialogContentStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		margin: '10px 15px',
	},
});

const useFormLabelStyles = makeStyles({
	root: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

interface Props {
	open: boolean;
	onClose: () => void;
	setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
	setPenSize: React.Dispatch<React.SetStateAction<number>>;
	penSize: number;
	currentColor: string;
}

const DEFAULT_SETTINGS: Settings = {
	currentColor: DEFAULT_CURRENT_COLOR,
	isSaveCurrentColorEnabled: true,
	isSavePenSizeEnabled: true,
	penSize: getDefaultPenSize(),
};

function SettingsDialog({
	open,
	onClose,
	setCurrentColor,
	setPenSize,
	currentColor,
	penSize,
}: Props) {
	const validateSettings = (settings: Settings): boolean => {
		const {
			currentColor,
			isSaveCurrentColorEnabled,
			isSavePenSizeEnabled,
			penSize,
		} = settings;
		return (
			typeof currentColor === 'string' &&
			typeof isSaveCurrentColorEnabled === 'boolean' &&
			typeof isSavePenSizeEnabled === 'boolean' &&
			typeof penSize === 'number'
		);
	};
	const getInitialSettings = (): Settings => {
		const settingsInLocalStorage = localStorage.getItem(
			LOCAL_STORAGE_SETTINGS_KEY
		);
		if (settingsInLocalStorage == null) return DEFAULT_SETTINGS;
		const parsedSettings = JSON.parse(settingsInLocalStorage) as Settings;
		if (!validateSettings(parsedSettings)) return DEFAULT_SETTINGS;
		return parsedSettings;
	};
	const [settings, setSettings] = useLocalStorage<Settings>(
		LOCAL_STORAGE_SETTINGS_KEY,
		getInitialSettings
	);
	const { isSaveCurrentColorEnabled, isSavePenSizeEnabled } = settings;
	const dialogContentStyles = useDialogContentStyles();
	const formLabelStyles = useFormLabelStyles();
	const handleCurrentColorSwitchChange = () => {
		setSettings((prevSettings) => ({
			...prevSettings,
			isSaveCurrentColorEnabled: !isSaveCurrentColorEnabled,
		}));
	};
	const handlePenSizeSwitchChange = () => {
		setSettings((prevSettings) => ({
			...prevSettings,
			isSavePenSizeEnabled: !isSavePenSizeEnabled,
		}));
	};
	useEffect(() => {
		// prettier-ignore
		if(settings.isSaveCurrentColorEnabled) setCurrentColor(settings.currentColor);
		if (settings.isSavePenSizeEnabled) setPenSize(settings.penSize);
		dispatchColorChangeEvent(settings.currentColor);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (!settings.isSaveCurrentColorEnabled) return;
		setSettings((prevSettings) => ({
			...prevSettings,
			currentColor,
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentColor, setSettings]);
	useEffect(() => {
		if (!settings.isSavePenSizeEnabled) return;
		setSettings((prevSettings) => ({
			...prevSettings,
			penSize,
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [penSize, setSettings]);
	return (
		<Backdrop open={open}>
			<Dialog open={open}>
				<DialogTitle>
					<Typography align="center" variant="h4">
						Settings
					</Typography>
				</DialogTitle>
				<DialogContent classes={dialogContentStyles}>
					<FormControlLabel
						label="Save current color"
						labelPlacement="start"
						classes={formLabelStyles}
						control={
							<Switch
								color="primary"
								checked={isSaveCurrentColorEnabled}
								onChange={handleCurrentColorSwitchChange}
							/>
						}
					/>
					<FormControlLabel
						label="Save pen size"
						labelPlacement="start"
						classes={formLabelStyles}
						control={
							<Switch
								color="primary"
								checked={isSavePenSizeEnabled}
								onChange={handlePenSizeSwitchChange}
							/>
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>ok</Button>
				</DialogActions>
			</Dialog>
		</Backdrop>
	);
}

export default SettingsDialog;
