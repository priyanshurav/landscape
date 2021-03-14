import { useEffect, useState } from 'react';

function useLocalStorage<T>(
	key: string,
	defaultValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [state, setState] = useState<T>(defaultValue);

	useEffect(() => {
		const valueInLocalStorage = localStorage.getItem(key);
		if (!valueInLocalStorage) return;
		setState(JSON.parse(valueInLocalStorage));
	}, [key]);

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(state));
		if (key === 'settings') console.log(state);
	}, [state, key]);

	return [state, setState];
}

export default useLocalStorage;
