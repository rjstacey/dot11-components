import React from 'react';
import styled from '@emotion/styled';
import {useDispatch, useSelector} from 'react-redux';

import {Button, ActionButtonDropdown} from '../form';

import type { AppTableDataSelectors, AppTableDataActions } from '../store/appTableData';
import type { ColumnProperties, ChangeableColumnProperties } from './AppTable';

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

type ItemProps = {
	disabled?: boolean;
	isSelected?: boolean;
};

const Item = styled.div<ItemProps>`
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

export type ColumnSelectorProps = {
	columns: Array<ColumnProperties>;
	selectors: AppTableDataSelectors<any>;
	actions: AppTableDataActions;
};

function ColumnSelectorDropdown({columns, selectors, actions}: ColumnSelectorProps) {

	const dispatch = useDispatch();

	const view = useSelector(selectors.selectCurrentView);
	const tableConfig = useSelector(selectors.selectCurrentTableConfig);

	const toggleCurrentTableFixed = () => dispatch(actions.toggleTableFixed({tableView: view}));
	const setTableColumnShown = (colKey: string, shown: boolean) => dispatch(actions.setTableColumnShown({tableView: view, key: colKey, shown}));

	/* Build an array of 'selectable' column config that includes a column label */
	const selectableColumns: Array<ChangeableColumnProperties & { key: string; label: string }> = [];
	for (const [key, config] of Object.entries<ChangeableColumnProperties>(tableConfig.columns)) {
		if (!config.unselectable) {
			const column = columns.find(c => c.key === key);
			selectableColumns.push({
				key,
				...config,
				label: (column && column.label)? column.label: key
			});
		}
	}

	return (
		<>
		<Row>
			<label>Table view:</label>
			<span>{view}</span>
		</Row>
		<Row>
			<label>Fixed width:</label>
			<Button
				onClick={toggleCurrentTableFixed}
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
						onChange={() => setTableColumnShown(col.key, !col.shown)}
					/>
					<span>{col.label}</span>
				</Item>
			)}
		</ItemList>
		</>
	)
}

const ColumnSelector = (props: ColumnSelectorProps) =>
	<ActionButtonDropdown
		name='columns'
		title='Configure table'
	>
		<ColumnSelectorDropdown {...props} />
	</ActionButtonDropdown>

export default ColumnSelector;
