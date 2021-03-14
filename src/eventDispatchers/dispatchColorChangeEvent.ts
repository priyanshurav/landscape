import { COLOR_CHANGE_EVENT } from '../constants';
import { ColorChangeEventDetail } from '../types';

const dispatchColorChangeEvent = (color: string) => {
	window.dispatchEvent(
		new CustomEvent<ColorChangeEventDetail>(COLOR_CHANGE_EVENT, {
			detail: { color },
		})
	);
};

export default dispatchColorChangeEvent;
