import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from '@emotion/styled';

import {ActionIcon} from '../icons';
import {Checkbox} from '../form';
import Dropdown from '../dropdown';

import type {
	AppTableDataSelectors,
	AppTableDataActions
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
	anchorEl: HTMLElement | null;
	customSelectorElement?: React.ReactNode;
	showExpanded?: boolean;
	selectors: AppTableDataSelectors<any>;
	actions: AppTableDataActions;
}

function ControlHeader({
	anchorEl,
	customSelectorElement,
	showExpanded,
	selectors,
	actions
}: ControlHeaderProps) {
	const dispatch = useDispatch();

	const selected = useSelector(selectors.selectSelected);
	const expanded = useSelector(selectors.selectExpanded);
	const shownIds = useSelector(selectors.selectSortedFilteredIds);

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

	const toggleSelect = () => dispatch(actions.setSelected(selected.length? []: shownIds));
	const toggleExpand = () => dispatch(actions.setExpanded(expanded.length? []: shownIds));

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
	rowId: string | number;
	showExpanded?: boolean;
	selectors: AppTableDataSelectors<any>;
	actions: AppTableDataActions;
};

function ControlCell({
	rowId,
	showExpanded,
	selectors,
	actions
}: ControlCellProps) {
	const dispatch = useDispatch();

	const toggleSelect = () => dispatch(actions.toggleSelected([rowId]));
	const toggleExpand = () => dispatch(actions.toggleExpanded([rowId]));

	const selected = useSelector(selectors.selectSelected)
	const expanded = useSelector(selectors.selectExpanded);

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
