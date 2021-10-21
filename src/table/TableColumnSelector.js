import PropTypes from 'prop-types'
import React from 'react'
import styled from '@emotion/styled'
import {connect} from 'react-redux'

import {Button} from '../icons'
import {ActionButtonDropdown} from '../general/Dropdown'
import {toggleTableFixed, setTableColumnShown} from '../store/appTableData'

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
	setTableColumnShown
}) {

	/* Build an array of 'selectable' column config that includes a column label */
	const selectableColumns = [];
	for (const [key, config] of Object.entries(tableConfig.columns)) {
		if (!config.unselectable) {
			const column = columns.find(c => c.key === key);
			selectableColumns.push({
				key,
				...config,
				label: column? column.label: key
			});
		}
	}

	return (
		<>
			<Row>
				<label>Table view:</label>
				<span>{tableView}</span>
			</Row>
			<Row>
				<label>Fixed width:</label>
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
						isSelected={col.shown}
					>
						<input
							type='checkbox'
							checked={col.shown}
							onChange={() => setTableColumnShown(tableView, col.key, !col.shown)}
						/>
						<span>{col.label}</span>
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
	setTableColumnShown: PropTypes.func.isRequired,
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
			setTableColumnShown: (tableView, key, shown) => dispatch(setTableColumnShown(dataSet, tableView, key, shown))
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
