import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from '@emotion/styled';
import {FixedSizeList as List} from 'react-window';

import {Icon} from '../icons';
import {Button, Checkbox, Input} from '../form';
import { Dropdown, DropdownRendererProps } from '../dropdown';

import {
	sortOptions, SortDirection, SortType,
	FilterType,
	SortDirectionType,
	Option,
	AppTableDataSelectors,
	AppTableDataActions
} from '../store/appTableData';

import type { HeaderCellRendererProps } from './AppTable';

const StyledCustomContainer = styled.div`
	margin: 10px 10px 0;
	line-height: 30px;
	padding-left: 20px;
	border: 1px solid #ccc;
	border-radius: 3px;
	:focus {
		outline: none;
		border: 1px solid deepskyblue;
	}
`;

const StyledInput = styled(Input)`
	margin: 5px 10px;
	padding: 10px;
`;

const StyledList = styled(List)`
	min-height: 35px;
	max-height: 250px;
	border: 1px solid #ccc;
	border-radius: 3px;
	margin: 10px;
`;

type ItemProps = {
	disabled?: boolean;
	isSelected?: boolean;
};

const Item = styled.div<ItemProps>`
	display: flex;
	align-items: center;
	${({ disabled }) => disabled && 'text-decoration: line-through;'}
	${({ isSelected }) => isSelected? 'background: #0074d9;': ':hover{background: #ccc;}'}
	& > div {
		margin: 5px 5px;
		${({ isSelected }) => isSelected && 'color: #fff;'}
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`;

const Row = styled.div`
	margin: 5px 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

function SortComponent({
	dataKey,
	selectors,
	actions,
}: {
	dataKey: string;
	selectors: AppTableDataSelectors;
	actions: AppTableDataActions;
}) {
	const {direction, type} = useSelector(state => selectors.selectSort(state, dataKey));
	const dispatch = useDispatch();
	const setSort = React.useCallback((direction: SortDirectionType) => dispatch(actions.setSortDirection({dataKey, direction})), [dispatch, actions, dataKey]);
	return (
		<Row>
			<label>Sort:</label>
			<span>
				<Button
					onClick={e => setSort(direction === "ASC"? "NONE": "ASC")}
					isActive={direction === SortDirection.ASC}
				>
					<Icon
						type='sort'
						direction={"ASC"}
						isAlpha={type !== SortType.NUMERIC}
					/>
				</Button>
				<Button
					onClick={e => setSort(direction === "DESC"? "NONE": "DESC")}
					isActive={direction === "DESC"}
				>
					<Icon
						type='sort'
						direction={"DESC"}
						isAlpha={type !== SortType.NUMERIC}
					/>
				</Button>
			</span>
		</Row>
	)
}

function FilterComponent({
	dataKey,
	selectors,
	actions,
	dataRenderer,
	customFilterElement,
}: {
	dataKey: string;
	selectors: AppTableDataSelectors;
	actions: AppTableDataActions;
	dataRenderer?: (value: any) => string;
	customFilterElement?: React.ReactNode;
}) {
	const [search, setSearch] = React.useState('');
	const inputRef = React.useRef<HTMLInputElement>(null);

	const dispatch = useDispatch();

	const selectInfo = React.useCallback(state => ({
		sort: selectors.selectSort(state, dataKey),
		filter: selectors.selectFilter(state, dataKey),
		selected: selectors.selectSelected(state),
		entities: selectors.selectEntities(state),
	}), [selectors, dataKey]);

	const {sort, filter, selected, entities} = useSelector(selectInfo);
	const getField = selectors.getField;

	const selectValues = React.useCallback(state => {
		const filter = selectors.selectFilter(state, dataKey);
		if (!filter)
			return [];
		let ids = selectors.selectIds(state);
		if (filter.comps.length === 0)
			ids = selectors.selectFilteredIds(state);
		const getField = selectors.getField;
		const entities = selectors.selectEntities(state);
		return [...new Set(ids.map(id => getField(entities[id]!, dataKey)))];
	}, [selectors, dataKey]);

	const values = useSelector(selectValues);

	const filterSelected = React.useCallback(() => {
		const comps = selected.map(id => ({value: getField(entities[id]!, dataKey), filterType: FilterType.EXACT}));
		dispatch(actions.setFilter({dataKey, comps}));
	}, [dispatch, actions, dataKey, selected, entities, getField]);

	const isFilterSelected = React.useMemo(() => {
		if (!filter)
			return false;
		const list = selected.map(id => getField(entities[id]!, dataKey));
		return filter.comps.map(comp => comp.value).join() === list.join();
	}, [filter, dataKey, selected, entities, getField]);

	interface FilterItem extends Option {
		type: number;
	};

	const options: Option[] = React.useMemo(() => {
		if (!filter)
			return [];

		if (filter.options)
			return filter.options;

		const renderLabel = (v: any) => {
			let s = dataRenderer? dataRenderer(v): v;
			if (s === '')
				s = '(Blank)';
			return s;
		}

		return values.map<Option>(v => ({value: v, label: renderLabel(v)}));

	}, [values, dataRenderer, filter]);

	let searchItems: FilterItem[] = [];
	if (filter) {
		searchItems = filter.comps
			.filter(comp => comp.filterType !== FilterType.EXACT)
			.map(comp => ({
				value: comp.value,
				label: (comp.filterType === FilterType.REGEX? 'Regex: ': 'Contains: ') + comp.value,
				type: comp.filterType
			}));
	}

	let exactItems: FilterItem[] = options.map(o => ({...o, type: FilterType.EXACT}));

	if (search) {
		let regexp;
		const parts = search.split('/');
		if (search[0] === '/' && parts.length > 2) {
			// User is entering a regex in the form /pattern/flags.
			// If the regex doesn't validate then ignore it
			try {regexp = new RegExp(parts[1], parts[2])} catch (err) {}
			if (regexp) {
				exactItems = exactItems.filter(item => regexp.test(item.label));
				let item = {
					label: 'Regex: ' + regexp.toString(),
					value: search,
					type: FilterType.REGEX
				};
				searchItems.unshift(item);
			}
		}
		else {
			regexp = new RegExp(search, 'i');
			exactItems = exactItems.filter(item => regexp.test(item.label));
			let item = {
				label: 'Contains: ' + search,
				value: search,
				type: FilterType.CONTAINS
			};
			searchItems.unshift(item);
		}
	}

	if (sort)
		exactItems = sortOptions(sort, exactItems);

	// "Contains:" and "Regex:" items at the top of the list
	const items = searchItems.concat(exactItems);

	React.useEffect(() => {
		if (search === '//' && inputRef.current)
			inputRef.current.setSelectionRange(1, 1);
	}, [search]);

	const isItemSelected = React.useCallback(
		(item: FilterItem) => filter !== undefined && filter.comps.find(comp => comp.value === item.value && comp.filterType === item.type) !== undefined,
		[filter]
	);

	const toggleItemSelected = React.useCallback(
		(item: FilterItem) => {
			setSearch('');
			if (isItemSelected(item))
				dispatch(actions.removeFilter({dataKey, value: item.value, filterType: item.type}));
			else
				dispatch(actions.addFilter({dataKey, value: item.value, filterType: item.type}));
		},
		[setSearch, isItemSelected, dispatch, actions, dataKey]
	);

	const onInputKey = React.useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			const target = e.target as HTMLInputElement;
			if (e.key === 'Enter' && target.value)
				toggleItemSelected(items[0]);
			if (e.key === '/' && !target.value) {
				// If search is empty and / is pressed, then add // to search
				// and position the cursor between the slashes (through useEffect on search change)
				e.preventDefault();
				setSearch('//');
			}
		},
		[setSearch, toggleItemSelected, items]
	);

	const itemHeight = 35;
	const listHeight = Math.min(items.length * itemHeight, 200);

	return (
		<>
			<Row>
				<label>Filter:</label>
				<Button
					onClick={filterSelected}
					disabled={selected.length === 0}
					isActive={isFilterSelected}
				>
					Selected
				</Button>
				<Button
					onClick={() => dispatch(actions.setFilter({dataKey, comps: []}))}
					isActive={filter && filter.comps.length === 0}
				>
					Clear
				</Button>
			</Row>
			{customFilterElement &&
				<StyledCustomContainer>
					{customFilterElement}
				</StyledCustomContainer>}
			<StyledInput
				type='search'
				value={search}
				ref={inputRef}
				onChange={e => setSearch(e.target.value)}
				onKeyDown={onInputKey}
				placeholder="Search..."
			/>
			<StyledList
				height={listHeight}
				itemCount={items.length}
				itemSize={itemHeight}
				width='auto'
			>
				{({index, style}) => {
					const item = items[index];
					const isSelected = isItemSelected(item);
					return (
						<Item
							key={item.value}
							style={style}
							isSelected={isSelected}
							onClick={() => toggleItemSelected(item)}
						>
							<Checkbox checked={isSelected} readOnly />
							<div>{item.label}</div>
						</Item>
					)
				}}
			</StyledList>
		</>
	)
}

const Header = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	user-select: none;
	width: 100%;
	overflow: hidden;
	box-sizing: border-box;
	margin-right: 5px;
	:hover {color: tomato}
	& .handle {
		position: absolute;
		right: 0;
		background: inherit;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}
`;

const Label = styled.label`
	font-weight: bold;
`;

type AppTableHeaderCellProps = HeaderCellRendererProps & {
	className?: string;
	style?: React.CSSProperties;
	customFilterElement?: React.ReactNode;
}

function AppTableHeaderCell({
	className,
	style,
	label,			// Column label
	dataKey,		// Identifies the data element in the row object
	column,
	anchorEl,
	selectors,
	actions,
	customFilterElement	// Custom filter element for dropdown
}: AppTableHeaderCellProps) {
	const selectInfo = React.useCallback((state) => {
		const sorts = selectors.selectSorts(state);
		const filter = selectors.selectFilter(state, dataKey);
		return {
			sort: sorts.settings[dataKey],
			isSorted: sorts.by.includes(dataKey),
			filter: filter,
			isFiltered: filter && filter.comps.length > 0,
		}
	}, [selectors, dataKey]);

	const {sort, isSorted, filter, isFiltered} = useSelector(selectInfo);

	if (!sort && !filter)
		return <Header><Label>{label}</Label></Header>

	const selectRenderer = ({state, methods}: DropdownRendererProps) =>
		<Header
			onClick={state.isOpen? methods.close: methods.open}
		>
			<Label>{label || dataKey}</Label>
			<div className='handle'>
				{isFiltered &&
					<Icon
						type='filter'
						style={{opacity: 0.2}}
					/>}
				{isSorted && 
					<Icon
						type='sort'
						style={{opacity: 0.2, paddingRight: 4}}
						direction={sort.direction}
						isAlpha={sort.type !== SortType.NUMERIC}
					/>}
				<Icon type='handle' isOpen={state.isOpen} />
			</div>
		</Header>;

	const dropdownRenderer = () =>
		<>
			{sort &&
				<SortComponent
					selectors={selectors}
					actions={actions}
					dataKey={dataKey}
				/>}
			{filter &&
				<FilterComponent
					selectors={selectors}
					actions={actions}
					dataKey={dataKey}
					dataRenderer={column.dataRenderer}
					customFilterElement={customFilterElement}
				/>}
		</>;

	if (!anchorEl)
		return null;

	return (
		<Dropdown
			className={className}
			style={style}
			selectRenderer={selectRenderer}
			dropdownRenderer={dropdownRenderer}
			portal={anchorEl}
		/>
	)
}

export default AppTableHeaderCell;
