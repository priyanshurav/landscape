import {
	Backdrop,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	makeStyles,
	Typography,
} from '@material-ui/core';
import React from 'react';
import Link from '../Link/Link';

interface Props {
	open: boolean;
	closeCreditDialog: () => void;
}

const useTypographyStyles = makeStyles({
	root: {
		padding: '5px 0',
	},
});

function CreditDialog({ open, closeCreditDialog }: Props) {
	const typographyStyles = useTypographyStyles();
	return (
		<Backdrop open={open}>
			<Dialog open={open}>
				<DialogTitle>
					<Typography variant="h4" align="center">
						Credits
					</Typography>
				</DialogTitle>
				<DialogContent>
					<Typography align="center" classes={typographyStyles}>
						Paint brush icon made by{' '}
						<Link href="http://www.freepik.com" title="Freepik">
							Freepik
						</Link>{' '}
						from{' '}
						<Link href="https://www.flaticon.com/" title="Flaticon">
							www.flaticon.com
						</Link>
					</Typography>

					<Typography align="center" classes={typographyStyles}>
						Bucket fill icon made by{' '}
						<Link href="http://www.freepik.com" title="Freepik">
							Freepik
						</Link>{' '}
						from{' '}
						<Link href="https://www.flaticon.com/" title="Flaticon">
							www.flaticon.com
						</Link>
					</Typography>

					<Typography align="center" classes={typographyStyles}>
						Color picker icon made by{' '}
						<Link href="http://www.freepik.com" title="Freepik">
							Freepik
						</Link>{' '}
						from{' '}
						<Link href="https://www.flaticon.com/" title="Flaticon">
							www.flaticon.com
						</Link>
					</Typography>

					<Typography align="center" classes={typographyStyles}>
						Eraser icon made by{' '}
						<Link
							href="https://www.flaticon.com/authors/freepik"
							title="Freepik"
						>
							Freepik
						</Link>{' '}
						from{' '}
						<Link href="https://www.flaticon.com/" title="Flaticon">
							www.flaticon.com
						</Link>
					</Typography>

					<Typography align="center" classes={typographyStyles}>
						Scenery icon made by{' '}
						<Link
							href="https://www.flaticon.com/authors/freepik"
							title="Freepik"
						>
							Freepik
						</Link>{' '}
						from{' '}
						<Link href="https://www.flaticon.com/" title="Flaticon">
							www.flaticon.com
						</Link>
					</Typography>

					<Typography align="center" classes={typographyStyles}>
						Credit icon made by{' '}
						<Link href="https://www.flaticon.com/authors/bqlqn" title="bqlqn">
							bqlqn
						</Link>{' '}
						from{' '}
						<Link href="https://www.flaticon.com/" title="Flaticon">
							{' '}
							www.flaticon.com
						</Link>
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeCreditDialog}>OK</Button>
				</DialogActions>
			</Dialog>
		</Backdrop>
	);
}

export default CreditDialog;
