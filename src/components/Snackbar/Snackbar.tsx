import {
	makeStyles,
	SnackbarCloseReason,
	IconButton,
	SnackbarContent,
	Snackbar as MuiSnackbar,
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { Close } from '@material-ui/icons';
import React from 'react';

const useSnackbarContentStyles = makeStyles({
	root: {
		backgroundColor: blue[500],
		color: 'white',
	},
});

interface Props {
	open: boolean;
	message: string;
	onClose: (
		_event: React.SyntheticEvent<any, Event>,
		reason: SnackbarCloseReason
	) => void;
	autoHideDuration?: number;
}

function Snackbar({ onClose, open, autoHideDuration, message }: Props) {
	const snackbarContentStyles = useSnackbarContentStyles();

	return (
		<MuiSnackbar
			open={open}
			autoHideDuration={autoHideDuration || 3500}
			onClose={onClose}
		>
			<SnackbarContent
				message={message}
				classes={snackbarContentStyles}
				action={
					<IconButton onClick={onClose as any}>
						<Close />
					</IconButton>
				}
			/>
		</MuiSnackbar>
	);
}

export default Snackbar;
