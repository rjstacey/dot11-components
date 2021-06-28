import PropTypes from 'prop-types'
import React from 'react'
import styled from '@emotion/styled'
import {connect} from 'react-redux'

import {Button} from '../lib/icons'
import {ActionButtonDropdown} from '../general/Dropdown'
import {toggleTableFixed, upsertTableColumns} from '../store/ui'

const Row = styled.div`
	margin: 5px 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const ItemList = styled.div`
	min-height: 10px;
	border: 1px solid #ccc;
	border-radius: 3px;
	margin: 10px;
	padding: 10px;
	overflow: auto;
`;

const Item = styled.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	${({ disabled }) => disabled && 'text-decoration: line-through;'}
	${({ isSelected }) => isSelected? 'background: #0074d9;': ':hover{background: #ccc;}'}
	& > span {
		margin: 5px 5px;
		${({ isSelected }) => isSelected && 'color: #fff;'}
	}
`;

function _ColumnSelectorDropdown({
	tableView,
	tableConfig,
	columns,
	toggleTableFixed,
	setTableColumnVisible
}) {

	/* Build an array of columns with the 'visible' property */
	const selectableColumns = columns
		.filter(col => !col.key.startsWith('__'))	// exclude control columns
		.map(col => ({
			...col,
			visible: (!(tableConfig && tableConfig.columns)) || tableConfig.columns[col.key].visible
		}));

	return (
		<>
			<Row>
				<label>Fixed column width:</label>
				<Button
					onClick={() => toggleTableFixed(tableView)}
					isActive={tableConfig.fixed}
				>
					On
				</Button>
			</Row>
			<ItemList>
				{selectableColumns.map((col) => 
					<Item
						key={col.key}
						isSelected={col.visible}
					>
						<input
							type='checkbox'
							checked={col.visible}
							onChange={() => setTableColumnVisible(tableView, col.key, !col.visible)}
						/>
						<span>{col.label || col.key}</span>
					</Item>
				)}
			</ItemList>
		</>
	)
}

_ColumnSelectorDropdown.propTypes = {
	tableView: PropTypes.string.isRequired,
	tableConfig: PropTypes.object,
	columns: PropTypes.array.isRequired,
	toggleTableFixed: PropTypes.func.isRequired,
	setTableColumnVisible: PropTypes.func.isRequired,
}

const ColumnSelectorDropdown = connect(
	(state, ownProps) => {
		const {dataSet} = ownProps;
		const tableView = state[dataSet].ui.tableView;
		const tableConfig = state[dataSet].ui.tablesConfig[tableView];
		return {
			tableView,
			tableConfig
		}
	},
	(dispatch, ownProps) => {
		const {dataSet} = ownProps;
		return {
			toggleTableFixed: (tableView) => dispatch(toggleTableFixed(dataSet, tableView)),
			setTableColumnVisible: (tableView, key, visible) => dispatch(upsertTableColumns(dataSet, tableView, {[key]: {visible}}))
		}
	}
)(_ColumnSelectorDropdown);

const ColumnSelector = (props) =>
	<ActionButtonDropdown
		name='columns'
		title='Configure table'
	>
		<ColumnSelectorDropdown {...props} />
	</ActionButtonDropdown>

ColumnSelector.propTypes = {
	dataSet: PropTypes.string.isRequired,
	columns: PropTypes.array.isRequired
}

export default ColumnSelector;
