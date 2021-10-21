import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import styled from '@emotion/styled'

import {ActionIcon} from '../icons'
import {Checkbox} from '../general/Form'
import Dropdown from '../general/Dropdown'

import {
	getSelected,
	setSelected,
	toggleSelected,
	getExpanded,
	setExpanded,
	toggleExpanded,
	getSortedFilteredIds
} from '../store/appTableData'

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

function _ControlHeader({
	shownIds,
	selected,
	setSelected,
	expanded,
	setExpanded,
	anchorEl,
	customSelectorElement
}) {

	const allSelected = React.useMemo(() => (
			shownIds.length > 0 &&	// not if list is empty
			shownIds.filter(id => !selected.includes(id)).length === 0
		),
		[shownIds, selected]
	);

	const isIndeterminate = !allSelected && selected.length;

	const allExpanded = React.useMemo(() => (
			expanded &&
			shownIds.length > 0 &&	// not if list is empty
			shownIds.filter(id => !expanded.includes(id)).length === 0
		),
		[shownIds, expanded]
	);

	const toggleAllSelected = () => setSelected(selected.length? []: shownIds);
	const toggleAllExpanded = () => setExpanded(expanded.length? []: shownIds);

	if (!anchorEl)
		return null;

	return (
		<Container>
			<Selector>
				<Checkbox
					title={allSelected? "Clear all": isIndeterminate? "Clear selected": "Select all"}
					checked={allSelected}
					indeterminate={isIndeterminate}
					onChange={toggleAllSelected}
				/>
				{customSelectorElement &&
					<Dropdown
						style={{display: 'flex', width: '100%', justifyContent: 'center'}}
						alignLeft
						portal
						anchorEl={anchorEl}
						dropdownRenderer={() => customSelectorElement}
					/>}
			</Selector>
			{expanded &&
				<ActionIcon
					type='double-expander'
					title="Expand all"
					open={allExpanded}
					onClick={toggleAllExpanded}
				/>
			}
		</Container>
	)
}

const SelectExpandHeader = connect(
	(state, ownProps) => ({
		selected: getSelected(state, ownProps.dataSet),
		expanded: getExpanded(state, ownProps.dataSet),
		shownIds: getSortedFilteredIds(state, ownProps.dataSet)
	}),
	(dispatch, ownProps) => ({
		setSelected: ids => dispatch(setSelected(ownProps.dataSet, ids)),
		setExpanded: ids => dispatch(setExpanded(ownProps.dataSet, ids))
	})
)(_ControlHeader);

SelectExpandHeader.propTypes = {
	dataSet: PropTypes.string.isRequired,
	anchorEl: PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
	customSelectorElement: PropTypes.element,
}

const SelectHeader = connect(
	(state, ownProps) => ({
		selected: getSelected(state, ownProps.dataSet),
		shownIds: getSortedFilteredIds(state, ownProps.dataSet)
	}),
	(dispatch, ownProps) => ({
		setSelected: ids => dispatch(setSelected(ownProps.dataSet, ids))
	})
)(_ControlHeader);

SelectHeader.propTypes = {
	dataSet: PropTypes.string.isRequired,
	anchorEl: PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
	customSelectorElement: PropTypes.element,
}

function _ControlCell({
	rowId,
	selected,
	toggleSelected,
	expanded,
	toggleExpanded
}) {
	return (
		<Container onClick={e => e.stopPropagation()} >
			<Checkbox
				title="Select row"
				checked={selected.includes(rowId)}
				onChange={() => toggleSelected(rowId)}
			/>
			{expanded && 
				<ActionIcon
					type='expander'
					title="Expand row"
					open={expanded.includes(rowId)}
					onClick={() => toggleExpanded(rowId)}
				/>
			}
		</Container>
	)
}

_ControlCell.propTypes = {
	selected: PropTypes.array.isRequired,
	toggleSelected: PropTypes.func.isRequired,
	expanded: PropTypes.array,
	toggleExpanded: PropTypes.func,
}

const SelectExpandCell = connect(
	(state, ownProps) => ({
		selected: getSelected(state, ownProps.dataSet),
		expanded: getExpanded(state, ownProps.dataSet)
	}),
	(dispatch, ownProps) => ({
		toggleSelected: id => dispatch(toggleSelected(ownProps.dataSet, [id])),
		toggleExpanded: id => dispatch(toggleExpanded(ownProps.dataSet, [id]))
	})
)(_ControlCell);

SelectExpandCell.propTypes = {
	dataSet: PropTypes.string.isRequired,
	rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

const SelectCell = connect(
	(state, ownProps) => ({
		selected: getSelected(state, ownProps.dataSet)
	}),
	(dispatch, ownProps) => ({
		toggleSelected: id => dispatch(toggleSelected(ownProps.dataSet, [id])),
	})
)(_ControlCell);

SelectCell.propTypes = {
	dataSet: PropTypes.string.isRequired,
	rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

export {SelectHeader, SelectCell, SelectExpandHeader, SelectExpandCell};