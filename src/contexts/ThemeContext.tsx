import React, { useContext } from 'react';
import { LOCAL_STORAGE_THEME_KEY } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';
import { Theme } from '../types';

interface ThemeContextValue {
	theme: Theme;
	setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export const useThemeContext = (): ThemeContextValue => {
	return useContext(ThemeContext) as ThemeContextValue;
};

interface Props {
	children: React.ReactNode;
}
export const ThemeProvider = ({ children }: Props) => {
	const [theme, setTheme] = useLocalStorage<Theme>(
		LOCAL_STORAGE_THEME_KEY,
		'light'
	);
	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
