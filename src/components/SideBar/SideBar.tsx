import { makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { SIDE_BAR_SIZE } from '../../constants';
import { ToolBarBtnTemplate, Tools } from '../../types';
import ToolBarButton from '../ToolBarButton/ToolBarButton';
import './SideBar.css';
import { useIsScreenSmallContext } from '../../contexts/ScreenSmallContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import ChangePenSize from '../ChangePenSize/ChangePenSize';
import CurrentColor from '../CurrentColor/CurrentColor';
import { Theme } from '../../types';

interface PaperStyleProps {
	isScreenSmall: boolean;
	theme: Theme;
}

const usePaperStyles = makeStyles({
	root: ({ isScreenSmall, theme }: PaperStyleProps) => ({
		height: isScreenSmall ? `${SIDE_BAR_SIZE}px` : '100vh',
		width: isScreenSmall ? '100vw' : `${SIDE_BAR_SIZE}px`,
		display: 'grid',
		gridTemplateColumns: isScreenSmall ? `1fr auto` : '',
		borderRight: isScreenSmall
			? ''
			: `1px solid ${theme === 'dark' ? '#fff' : '#000'}`,
		borderTop: isScreenSmall
			? `1px solid ${theme === 'dark' ? '#fff' : '#000'}`
			: '',
	}),
});

interface Props {
	currentTool: Tools;
	setCurrentTool: React.Dispatch<React.SetStateAction<Tools>>;
	toolBarBtns: ToolBarBtnTemplate[];
	currentColor: string;
	setPenSize: React.Dispatch<React.SetStateAction<number>>;
	penSize: number;
}

function SideBar({
	currentTool,
	setCurrentTool,
	toolBarBtns,
	currentColor,
	penSize,
	setPenSize,
}: Props) {
	const isScreenSmall = useIsScreenSmallContext();
	const { theme } = useThemeContext();
	const paperStyles = usePaperStyles({ isScreenSmall, theme });
	return (
		<Paper classes={paperStyles} square>
			<div
				className={`tool-bar ${theme} ${isScreenSmall ? 'small-screen' : ''}`}
				style={{ '--number-of-tools': toolBarBtns.length.toString() } as any}
			>
				{toolBarBtns.map(({ isSelectable, onClick }, index) => (
					<ToolBarButton
						currentTool={currentTool}
						toolBarBtn={toolBarBtns[index]}
						onClick={
							(!isSelectable && onClick) || ((tool) => setCurrentTool(tool))
						}
						key={index}
					/>
				))}
			</div>
			<div className={`status ${isScreenSmall ? 'small-screen' : ''} ${theme}`}>
				<CurrentColor currentColor={currentColor} />
				<ChangePenSize penSize={penSize} setPenSize={setPenSize} />
			</div>
		</Paper>
	);
}

export default SideBar;
