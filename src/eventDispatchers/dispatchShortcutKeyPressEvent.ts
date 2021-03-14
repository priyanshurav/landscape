import { SHORTCUT_KEY_PRESS_EVENT } from '../constants';
import { ShortcutKeyPressEventDetail, Tools } from '../types';

const dispatchShortcutKeyPressEvent = (tool: Tools) => {
	window.dispatchEvent(
		new CustomEvent<ShortcutKeyPressEventDetail>(SHORTCUT_KEY_PRESS_EVENT, {
			detail: { tool },
		})
	);
};

export default dispatchShortcutKeyPressEvent;
