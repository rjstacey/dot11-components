import PropTypes from 'prop-types';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {adjustPanelSplit, selectCurrentPanelConfig} from '../store/appTableData';

import ColumnResizer from './ColumnResizer';

export const Panel = ({children, ...otherProps}) =>
	<div {...otherProps} >
		{children}
	</div>

function SplitPanel({dataSet, style, children, ...otherProps}) {
	const dispatch = useDispatch();
	const adjustSplit = React.useCallback((deltaX) => dispatch(adjustPanelSplit(dataSet, undefined, deltaX/window.innerWidth)), [dispatch, dataSet]);

	const selectPanelConfig = React.useCallback(state => selectCurrentPanelConfig(state, dataSet), [dataSet]);
	const {isSplit, split} = useSelector(selectPanelConfig);

	//const [split, setSplit] = React.useState(0.5);
	//const setWidth = (deltaX) => setSplit(split => split - deltaX/window.innerWidth);
	const style0 = children[0].props.style || {};
	const style1 = children[1].props.style || {};

	return (
		<div style={{display: 'flex', flex: 1, width: '100%', overflow: 'hidden', ...style}} {...otherProps} >
			{React.cloneElement(children[0], {style: {...style0, flex: `${100 - split*100}%`}})}
			{isSplit &&
				<>
					<ColumnResizer setWidth={adjustSplit} />
					{React.cloneElement(children[1], {style: {...style1, flex: `${split*100}%`}})}
				</>}
		</div>
	)
}

SplitPanel.propTypes = {
	dataSet: PropTypes.string.isRequired,
	children: (props, propName, componentName) => {
		const prop = props[propName];
		if (React.Children.count(prop) !== 2)
			return new Error('`' + componentName + '` has invalid number of children; expect exactly two');
		let error;
		React.Children.forEach(prop, (el) => {
			if (el.type !== Panel)
				error = new Error('`' + componentName + '` has invalid child; expect only Panel children')
		});
		return error;
	}
}

export default SplitPanel;
