import React from 'react';
import { Link as MuiLink } from '@material-ui/core';

interface Props {
	href: string;
	title: string;
	children: React.ReactNode;
}

function Link({ href, children, title }: Props) {
	return (
		<MuiLink
			href={href}
			title={title}
			target="_blank"
			rel="noopener noreferrer"
		>
			{children}
		</MuiLink>
	);
}

export default Link;
