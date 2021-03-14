import { useMediaQuery } from '@material-ui/core';
import React, { useContext } from 'react';
import { SMALL_SCREEN_THRESHOLD } from '../constants';

const ScreenSmallContext = React.createContext(false);

export const useIsScreenSmallContext = (): boolean => {
	return useContext(ScreenSmallContext);
};

interface Props {
	children: React.ReactNode;
}
export const IsScreenSmallProvider = ({ children }: Props) => {
	const isScreenSmall = useMediaQuery(
		`(max-width: ${SMALL_SCREEN_THRESHOLD}px)`
	);
	return (
		<ScreenSmallContext.Provider value={isScreenSmall}>
			{children}
		</ScreenSmallContext.Provider>
	);
};
