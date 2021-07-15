import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'

import {Button} from '../lib/icons'
import {setTableView} from '../store/ui'

function _TableViewSelector({tablesConfig, tableView, setTableView}) {
	const tableViews = Object.keys(tablesConfig);
	return tableViews.map(view => 
		<Button
			key={view}
			isActive={tableView === view}
			onClick={() => setTableView(view)}
		>
			{view}
		</Button>
	)
}

const TableViewSelector = connect(
	(state, ownProps) => {
		const {dataSet} = ownProps;
		return {
			tableView: state[dataSet].ui.tableView,
			tablesConfig: state[dataSet].ui.tablesConfig
		}
	},
	(dispatch, ownProps) => {
		const {dataSet} = ownProps;
		return {
			setTableView: (view) => dispatch(setTableView(dataSet, view))
		}
	}
)(_TableViewSelector);

TableViewSelector.propTypes = {
	dataSet: PropTypes.string.isRequired,
}

export default TableViewSelector;
