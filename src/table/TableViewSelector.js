import PropTypes from 'prop-types';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Button} from '../form';
import {setTableView} from '../store/appTableData';

function TableViewSelector({dataSet}) {
	const dispatch = useDispatch();

	const selectInfo = React.useCallback(state => {
		const {tableView, tablesConfig} = state[dataSet].ui;
		const tableViews = Object.keys(tablesConfig);
		return {tableView, tableViews};
	}, [dataSet]);
	const {tableView, tableViews} = useSelector(selectInfo);

	return tableViews.map(view => 
		<Button
			key={view}
			isActive={tableView === view}
			onClick={() => dispatch(setTableView(dataSet, view))}
		>
			{view}
		</Button>
	)
}

TableViewSelector.propTypes = {
	dataSet: PropTypes.string.isRequired,
}

export default TableViewSelector;
