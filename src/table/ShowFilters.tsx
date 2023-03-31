import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from '@emotion/styled';

import {ActionIcon} from '../icons';

import {
	globalFilterKey,
	Fields,
	Filters,
	AppTableDataSelectors,
	AppTableDataActions
} from '../store/appTableData';

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

interface ActiveFilterProps {
	remove: (e: MouseEvent) => void;
	children?: React.ReactNode;
}

const ActiveFilter = ({children, remove}: ActiveFilterProps) =>
	<ActiveFilterContainer role='listitem'>
		{children && <ActiveFilterItem>{children}</ActiveFilterItem>}
		<ActionIcon style={{minWidth: 16}} type='clear' onClick={remove} />
	</ActiveFilterContainer>

function renderActiveFilters({
	fields,
	filters,
	removeFilter,
	clearAllFilters
}: {
	fields: Fields;
	filters: Filters;
	removeFilter: (dataKey: string, value: any, filterType: number) => void;
	clearAllFilters: () => void;
}) {
	let elements: React.ReactNode[] = [];
	for (const [dataKey, filter] of Object.entries(filters)) {
		if (dataKey === globalFilterKey)
			continue;
		if (!fields[dataKey]) {
			console.warn(`${dataKey} not present in fields`);
			continue;
		}
		const {label, dataRenderer} = fields[dataKey];
		const {comps, options} = filter;
		if (comps.length > 0) {
			elements.push(
				<ActiveFilterLabel key={dataKey}>
					{label + ':'}
				</ActiveFilterLabel>
			);
			for (let comp of comps) {
				const o = options && options.find(o => o.value === comp.value);
				let s = o? o.label: (dataRenderer? dataRenderer(comp.value): comp.value);
				if (s === '')
					s = '(Blank)'
				elements.push(
					<ActiveFilter 
						key={`${dataKey}_${comp.value}`}
						remove={() => removeFilter(dataKey, comp.value, comp.filterType)}
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

type ShowFiltersProps = {
	className?: string;
	style?: React.CSSProperties;
	fields: Fields;
	selectors: AppTableDataSelectors,
	actions: AppTableDataActions,
};

function ShowFilters({
	className,
	style,
	fields,
	selectors,
	actions
}: ShowFiltersProps) {
	const dispatch = useDispatch();

	const totalRows = useSelector(selectors.selectIds).length;
	const shownRows = useSelector(selectors.selectSortedFilteredIds).length;
	const filters = useSelector(selectors.selectFilters);

	const activeFilterElements = React.useMemo(() => {
		const removeFilter = (dataKey: string, value: any, filterType: number) => dispatch(actions.removeFilter({dataKey, value, filterType}));
		const clearAllFilters = () => dispatch(actions.clearAllFilters());

		return renderActiveFilters({fields, filters, removeFilter, clearAllFilters});
	}, [actions, fields, filters, dispatch]);

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

export default ShowFilters;
