import PropTypes from 'prop-types';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Button} from '../form';
import {setTableView, selectCurrentView, selectViews} from '../store/appTableData';

type TableViewSelectorProps = {
	dataSet: string;
};

function TableViewSelector({dataSet}: TableViewSelectorProps) {
	const dispatch = useDispatch();

	const selectInfo = React.useCallback(state => ({
		currentView: selectCurrentView(state, dataSet),
		allViews: selectViews(state, dataSet)
	}), [dataSet]);

	const {currentView, allViews} = useSelector(selectInfo);

	return (
		<>
			{allViews.map(v => 
				<Button
					key={v}
					isActive={currentView === v}
					onClick={() => dispatch(setTableView(dataSet, v))}
				>
					{v}
				</Button>
			)}
		</>
	)
}

TableViewSelector.propTypes = {
	dataSet: PropTypes.string.isRequired,
}

export default TableViewSelector;
