import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import styled from '@emotion/styled'

import {ActionIcon} from '../icons'

import {
	getFilters,
	removeFilter,
	clearAllFilters,
	getIds,
	getSortedFilteredIds
} from '../store/appTableData'

const ActiveFilterLabel = styled.label`
	font-weight: bold;
	line-height: 22px;
	margin: 3px;
`;

const ActiveFilterContainer = styled.div`
	display: flex;
	flex-direction: row;
	height: 22px;
	max-width: 200px;
	margin: 3px 3px 3px 0;
	background: #0074d9;
	color: #fff;
	border-radius: 3px;
	align-items: center;
	:hover {opacity: 0.9}`

const ActiveFilterItem = styled.span`
	color: #fff;
	line-height: 21px;
	padding: 0 0 0 5px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;

const ActiveFilter = ({children, remove}) =>
	<ActiveFilterContainer role='listitem' direction='ltr'>
		{children && <ActiveFilterItem>{children}</ActiveFilterItem>}
		<ActionIcon type='clear' onClick={remove} />
	</ActiveFilterContainer>

function renderActiveFilters({fields, filters, removeFilter, clearAllFilters}) {
	let elements = [];
	for (const [dataKey, filter] of Object.entries(filters)) {
		const {label, dataRenderer} = fields[dataKey];
		const {values, options} = filter;
		if (values.length > 0) {
			elements.push(
				<ActiveFilterLabel key={dataKey}>
					{label + ':'}
				</ActiveFilterLabel>
			);
			for (let v of values) {
				const o = options && options.find(o => o.value === v.value);
				let s = o? o.label: (dataRenderer? dataRenderer(v.value): v.value);
				if (s === '')
					s = '(Blank)'
				elements.push(
					<ActiveFilter 
						key={`${dataKey}_${v.value}`}
						remove={() => removeFilter(dataKey, v.value, v.filterType)}
					>
						{s}
					</ActiveFilter>
				);
			}
		}
	}
	if (elements.length > 2) {
		elements.push(<ActiveFilterLabel key='clear_all_label'>Clear All:</ActiveFilterLabel>)
		elements.push(<ActiveFilter key='clear_all' remove={clearAllFilters} />)
	}
	return elements
}

const FiltersContainer = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
`;

const FiltersLabel = styled.div`
	margin-right: 5px;
	& label {
		font-weight: bold;
	}
`;

const FiltersPlaceholder = styled.span`
	color: #ccc;
	margin-left: 5px;
`;

const FiltersContent = styled.div`
	flex: 1;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-content: flex-start;
	border: solid 1px #ccc;
	border-radius: 3px;
`;

function _ShowFilters({
	style,
	className,
	totalRows,
	shownRows,
	fields,
	filters,
	removeFilter,
	clearAllFilters,
	...otherProps
}) {
	const activeFilterElements = renderActiveFilters({fields, filters, removeFilter, clearAllFilters})

	return (
		<FiltersContainer
			style={style}
			className={className}
		>
			<FiltersLabel>
				<label>Filters:</label><br/>
				<span>{`Showing ${shownRows} of ${totalRows}`}</span>
			</FiltersLabel>
			<FiltersContent>
				{activeFilterElements.length? activeFilterElements: <FiltersPlaceholder>No filters</FiltersPlaceholder>}
			</FiltersContent>
		</FiltersContainer>
	)
}

_ShowFilters.propTypes = {
	totalRows: PropTypes.number.isRequired,
	shownRows: PropTypes.number.isRequired,
	filters: PropTypes.object.isRequired,
	removeFilter: PropTypes.func.isRequired,
	clearAllFilters: PropTypes.func.isRequired
}

const ShowFilters = connect(
	(state, ownProps) => {
		const {dataSet} = ownProps;
		return {
			totalRows: getIds(state, dataSet).length,
			shownRows: getSortedFilteredIds(state, dataSet).length,
			filters: getFilters(state, dataSet)
		}
	},
	(dispatch, ownProps) => {
		const {dataSet} = ownProps;
		return {
			removeFilter: (dataKey, value, filterType) => dispatch(removeFilter(dataSet, dataKey, value, filterType)),
			clearAllFilters: () => dispatch(clearAllFilters(dataSet)),
		}
	}
)(_ShowFilters);

ShowFilters.propTypes = {
	dataSet: PropTypes.string.isRequired,
	fields: PropTypes.object.isRequired
}

export default ShowFilters;
