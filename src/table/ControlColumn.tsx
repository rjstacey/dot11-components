import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from '@emotion/styled';

import {ActionIcon} from '../icons';
import {Checkbox} from '../form';
import Dropdown from '../dropdown';

import {
	selectSelected,
	setSelected,
	toggleSelected,
	selectExpanded,
	setExpanded,
	toggleExpanded,
	selectSortedFilteredIds
} from '../store/appTableData';

const Selector = styled.div`
	display: flex;
	flex-direction: row;
	border-radius: 3px;
	align-items: center;
	:hover {color: tomato};
	:hover,
	:focus-within {
		background-color: #ddd;
	}
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

type ControlHeaderProps = {
	dataSet: string;
	anchorEl: HTMLElement | null;
	customSelectorElement?: React.ReactNode;
	showExpanded?: boolean;
}

function ControlHeader({
	dataSet,
	anchorEl,
	customSelectorElement,
	showExpanded
}: ControlHeaderProps) {
	const dispatch = useDispatch();

	const selectInfo = React.useCallback(state => ({
		selected: selectSelected(state, dataSet),
		expanded: selectExpanded(state, dataSet),
		shownIds: selectSortedFilteredIds(state, dataSet)
	}), [dataSet]);

	const {selected, expanded, shownIds} = useSelector(selectInfo);

	const allSelected = React.useMemo(() => (
			shownIds.length > 0 &&	// not if list is empty
			shownIds.filter(id => !selected.includes(id)).length === 0
		),
		[shownIds, selected]
	);

	const isIndeterminate = !allSelected && selected.length > 0;

	const allExpanded = React.useMemo(() => (
			expanded &&
			shownIds.length > 0 &&	// not if list is empty
			shownIds.filter(id => !expanded.includes(id)).length === 0
		),
		[shownIds, expanded]
	);

	const toggleSelect = React.useCallback(() => dispatch(setSelected(dataSet, selected.length? []: shownIds)), [dispatch, dataSet, selected, shownIds]);
	const toggleExpand = React.useCallback(() => dispatch(setExpanded(dataSet, expanded.length? []: shownIds)), [dispatch, dataSet, expanded, shownIds]);

	if (!anchorEl)
		return null;

	return (
		<Container>
			<Selector>
				<Checkbox
					title={allSelected? "Clear all": isIndeterminate? "Clear selected": "Select all"}
					checked={allSelected}
					indeterminate={isIndeterminate}
					onChange={toggleSelect}
				/>
				{customSelectorElement &&
					<Dropdown
						style={{display: 'flex', width: '100%', justifyContent: 'center'}}
						dropdownAlign='left'
						portal={anchorEl}
						dropdownRenderer={() => customSelectorElement}
					/>}
			</Selector>
			{showExpanded &&
				<ActionIcon
					type='double-expander'
					title="Expand all"
					open={allExpanded}
					onClick={toggleExpand}
				/>
			}
		</Container>
	)
}

const SelectExpandHeader = (props: Omit<ControlHeaderProps, "showExpanded">) => <ControlHeader showExpanded {...props}/>
const SelectHeader = (props: ControlHeaderProps) => <ControlHeader {...props}/>

type ControlCellProps = {
	dataSet: string;
	rowId: string | number;
	showExpanded?: boolean;
};

function ControlCell({
	dataSet,
	rowId,
	showExpanded
}: ControlCellProps) {
	const dispatch = useDispatch();
	const toggleSelect = React.useCallback(() => dispatch(toggleSelected(dataSet, [rowId])), [dispatch, dataSet, rowId]);
	const toggleExpand = React.useCallback(() => dispatch(toggleExpanded(dataSet, [rowId])), [dispatch, dataSet, rowId]);

	const selectInfo = React.useCallback(state => ({
		selected: selectSelected(state, dataSet),
		expanded: selectExpanded(state, dataSet),
	}), [dataSet]);

	const {selected, expanded} = useSelector(selectInfo);

	return (
		<Container onClick={e => e.stopPropagation()} >
			<Checkbox
				title="Select row"
				checked={selected.includes(rowId)}
				onChange={toggleSelect}
			/>
			{showExpanded && 
				<ActionIcon
					type='expander'
					title="Expand row"
					open={expanded.includes(rowId)}
					onClick={toggleExpand}
				/>
			}
		</Container>
	)
}

const SelectExpandCell = (props: Omit<ControlCellProps, "showExpanded">) => <ControlCell showExpanded {...props} />
const SelectCell = (props: ControlCellProps) => <ControlCell {...props} />

export {SelectHeader, SelectCell, SelectExpandHeader, SelectExpandCell};
