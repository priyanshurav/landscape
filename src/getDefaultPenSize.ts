import { DEFAULT_PEN_SIZE, MAX_PEN_SIZE, MIN_PEN_SIZE } from './constants';

const getDefaultPenSize = (): number => {
	if (DEFAULT_PEN_SIZE > MAX_PEN_SIZE) return MAX_PEN_SIZE;
	else if (DEFAULT_PEN_SIZE < MIN_PEN_SIZE) return MIN_PEN_SIZE;
	return DEFAULT_PEN_SIZE;
};

export default getDefaultPenSize;
