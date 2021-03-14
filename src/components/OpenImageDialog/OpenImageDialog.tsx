import {
	Backdrop,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	makeStyles,
	SnackbarCloseReason,
	Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Photo, SnackbarState } from '../../types';
import OpenImageDialogInput from '../OpenImageDialogInput/OpenImageDialogInput';
import Snackbar from '../Snackbar/Snackbar';

interface Props {
	open: boolean;
	ctx: CanvasRenderingContext2D;
	closeDialog: () => void;
}

const useDialogStyles = makeStyles({
	root: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
	},
});
const usePhotoNameStyles = makeStyles({
	root: {
		marginLeft: '10px',
	},
});

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';

function OpenImageDialog({ open, closeDialog, ctx }: Props) {
	const [photo, setPhoto] = useState<Photo>();
	const [snackBarState, setSnackbarState] = useState<SnackbarState>({
		open: false,
		message: '',
	});
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);
	const dialogStyles = useDialogStyles();
	const photoNameStyles = usePhotoNameStyles();
	const resetAndClose = () => {
		fileInput.value = '';
		setHeight(0);
		setWidth(0);
		setX(0);
		setY(0);
		setPhoto(undefined);
		closeDialog();
	};
	const handleFileInputChange = async () => {
		const file = fileInput.files?.item(0);
		if (!file) return;
		const image = new Image();
		image.src = URL.createObjectURL(file);
		image.addEventListener('load', () => {
			setWidth(image.width);
			setHeight(image.height);
		});
		setPhoto({ file: file, name: file.name });
	};
	const handleOkBtnClick = (): void => {
		if (!photo)
			return setSnackbarState({
				open: true,
				message: 'You must choose a photo',
			});

		const image = new Image();
		image.src = URL.createObjectURL(photo.file);
		image.addEventListener('load', () => {
			ctx.drawImage(image, x, y, width, height);
			resetAndClose();
		});
	};
	const handleSnackbarClose = (
		_event: React.SyntheticEvent<any, Event>,
		reason: SnackbarCloseReason
	) => {
		if (reason === 'clickaway') return;
		setSnackbarState({ open: false, message: '' });
	};
	useEffect(() => {
		fileInput.addEventListener('change', handleFileInputChange);
		return () => fileInput.removeEventListener('change', handleFileInputChange);
	}, []);
	return (
		<>
			<Backdrop open={open}>
				<Dialog open={open}>
					<DialogTitle>Open image</DialogTitle>
					<DialogContent classes={dialogStyles}>
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							paddingBottom="10px"
						>
							<Button
								variant="contained"
								color="primary"
								onClick={() => fileInput.click()}
							>
								Choose a photo
							</Button>
							<Typography classes={photoNameStyles}>
								{photo?.name ? photo.name : 'No photo chosen'}
							</Typography>
						</Box>
						<OpenImageDialogInput
							id="width-input"
							label="Width"
							onChange={setWidth}
							value={width}
						/>
						<OpenImageDialogInput
							id="height-input"
							label="Height"
							onChange={setHeight}
							value={height}
						/>
						<OpenImageDialogInput
							id="x-input"
							label="X"
							onChange={setX}
							value={x}
						/>
						<OpenImageDialogInput
							id="y-input"
							label="Y"
							onChange={setY}
							value={y}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={resetAndClose}>cancel</Button>
						<Button onClick={handleOkBtnClick}>ok</Button>
					</DialogActions>
				</Dialog>
			</Backdrop>
			<Snackbar
				open={snackBarState.open}
				message={snackBarState.message}
				onClose={handleSnackbarClose}
			/>
		</>
	);
}

export default OpenImageDialog;
