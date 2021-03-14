import { Input } from '@material-ui/core';
import React from 'react';
import './OpenImageDialogInput.css';

interface Props {
	value: number;
	onChange: (value: number) => void;
	id: string;
	label: string;
}

function OpenImageDialogInput({ onChange, value, id, label }: Props) {
	const handleChange = (
		e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		if (e.target.value === '') return onChange(0);
		onChange(parseInt(e.target.value, 10));
	};
	return (
		<div className="open-image-dialog-input">
			<label htmlFor={id}>{label}</label>
			<Input value={value} onChange={handleChange} id={id} />
		</div>
	);
}

export default OpenImageDialogInput;
