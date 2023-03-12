//import PropTypes from 'prop-types';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ActionButton} from '../form';
import {setPanelWidth, setPanelIsSplit, selectCurrentPanelConfig} from '../store/appTableData';

import ColumnResizer from './ColumnResizer';

interface SplitPanelButtonProps extends React.ComponentProps<typeof ActionButton> {
	dataSet: string;
	title?: string;
}
export function SplitPanelButton({dataSet, title, ...otherProps}: SplitPanelButtonProps) {
	const dispatch = useDispatch();
	const selectPanelConfig = React.useCallback(state => selectCurrentPanelConfig(state, dataSet), [dataSet]);
	let {isSplit} = useSelector(selectPanelConfig);
	const setIsSplit = (isSplit) => dispatch(setPanelIsSplit(dataSet, undefined, isSplit));

	return (
		<ActionButton
			name='book-open'
			title={title || 'Show detail'}
			isActive={isSplit}
			onClick={() => setIsSplit(!isSplit)}
			{...otherProps}
		/>
	)
}

interface PanelProps extends React.HTMLProps<HTMLDivElement> {
	children?: React.ReactNode;
}

export const Panel = ({children, ...otherProps}: PanelProps) => <div {...otherProps} >{children}</div>;

interface SplitPanelProps {
	dataSet: string;
	style?: React.CSSProperties;
	className?: string;
	children: [React.ReactElement<PanelProps>, React.ReactElement<PanelProps>];
}

export function SplitPanel({dataSet, style, children, ...otherProps}: SplitPanelProps) {
	const dispatch = useDispatch();
	const ref = React.useRef<HTMLDivElement>(null);
	const selectPanelConfig = React.useCallback(state => selectCurrentPanelConfig(state, dataSet), [dataSet]);
	let {isSplit, width} = useSelector(selectPanelConfig);

	let content; 
	if (isSplit) {
		if (typeof width !== 'number' || isNaN(width) || width < 0 || width > 1)
			width = 0.5;
		const leftStyle = {...children[0].props.style, flex: `${width*100}%`};
		const rightStyle = {...children[1].props.style, flex: `${(1 - width)*100}%`};
		const onDrag = (event, {x, deltaX}) => {
			const b = (ref.current as HTMLDivElement).getBoundingClientRect();	// only called after ref established
			dispatch(setPanelWidth(dataSet, undefined, (x - b.x)/(b.width - 5)));
		};
		content =
			<>
				{React.cloneElement(children[0], {style: leftStyle})}
				<ColumnResizer onDrag={onDrag}/>
				{React.cloneElement(children[1], {style: rightStyle})}
			</>
	}
	else {
		const leftStyle = {...children[0].props.style, flex: '100%'};
		content = React.cloneElement(children[0], {style: leftStyle});
	}

	return (
		<div
			ref={ref}
			style={{display: 'flex', flex: 1, width: '100%', overflow: 'hidden', ...style}}
			{...otherProps}
		>
			{content}
		</div>
	)
}

/*const checkChildren = (props, propName, componentName) => {
	const {children} = props;
	if (React.Children.count(children) !== 2)
		return new Error('`' + componentName + '` has invalid number of children; expect exactly two');
	let error;
	React.Children.forEach(children, (el) => {
		if (el.type !== Panel)
			error = new Error('`' + componentName + '` has invalid child; expect only Panel children')
	});
	return error;
}

SplitPanel.propTypes = {
	dataSet: PropTypes.string.isRequired,
	children: checkChildren
}*/

export default SplitPanel;
