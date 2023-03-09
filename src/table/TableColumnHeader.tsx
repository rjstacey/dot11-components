import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from '@emotion/styled';
import {FixedSizeList as List} from 'react-window';

import {Icon} from '../icons';
import {Button, Checkbox, Input} from '../form';
import { Dropdown, RendererProps } from '../dropdown';

import {
	selectGetField,
	selectEntities,
	selectIds,
	selectFilteredIds,
	selectSorts, selectSort, sortSet, sortOptions, SortDirection, SortType,
	selectFilter, setFilter, addFilter, removeFilter, FilterType,
	selectSelected,
	SortDirectionType,
	Sort,
	Option
} from '../store/appTableData';

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

type SortProps = {
	dataSet: string;
	dataKey: string;
};

function SortComponent({dataSet, dataKey}: SortProps) {
	const {direction, type} = useSelector<any, Sort>(state => state[dataSet].sorts.settings[dataKey]);
	const dispatch = useDispatch();
	const setSort = React.useCallback((direction: SortDirectionType) => dispatch(sortSet(dataSet, dataKey, direction)), [dispatch, dataSet, dataKey]);
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

type FilterProps = {
	dataSet: string;
	dataKey: string;
	dataRenderer?: (value: any) => string;
	customFilterElement?: React.ReactNode;
};

function FilterComponent({
	dataSet,
	dataKey,
	dataRenderer,
	customFilterElement,
}: FilterProps) {
	const [search, setSearch] = React.useState('');
	const inputRef = React.useRef<HTMLInputElement>(null);

	const dispatch = useDispatch();

	const selectInfo = React.useCallback(state => ({
		sort: selectSort(state, dataSet, dataKey),
		filter: selectFilter(state, dataSet, dataKey),
		selected: selectSelected(state, dataSet),
		entities: selectEntities(state, dataSet),
		getField: selectGetField(state, dataSet)
	}), [dataSet, dataKey]);

	const {sort, filter, selected, entities, getField} = useSelector(selectInfo);

	const selectValues = React.useCallback(state => {
		const filter = selectFilter(state, dataSet, dataKey);
		if (!filter)
			return [];
		let ids = selectIds(state, dataSet);
		if (filter.comps.length === 0)
			ids = selectFilteredIds(state, dataSet);
		const getField = selectGetField(state, dataSet);
		const entities = selectEntities(state, dataSet);
		return [...new Set(ids.map(id => getField(entities[id], dataKey)))];
	}, [dataSet, dataKey]);

	const values = useSelector(selectValues);

	const filterSelected = React.useCallback(() => {
		const comps = selected.map(id => ({value: getField(entities[id], dataKey), filterType: FilterType.EXACT}));
		dispatch(setFilter(dataSet, dataKey, comps));
	}, [dispatch, dataSet, dataKey, selected, entities, getField]);

	const isFilterSelected = React.useMemo(() => {
		if (!filter)
			return false;
		const list = selected.map(id => getField(entities[id], dataKey));
		return filter.comps.map(comp => comp.value).join() === list.join();
	}, [filter, dataKey, selected, entities, getField]);

	interface FilterItem extends Option {
		type: number;
	};

	const options: Array<Option> = React.useMemo(() => {
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

	let searchItems: Array<FilterItem> = [];
	if (filter) {
		searchItems = filter.comps
			.filter(comp => comp.filterType !== FilterType.EXACT)
			.map(comp => ({
				value: comp.value,
				label: (comp.filterType === FilterType.REGEX? 'Regex: ': 'Contains: ') + comp.value,
				type: comp.filterType
			}));
	}

	let exactItems: Array<FilterItem> = options.map(o => ({...o, type: FilterType.EXACT}));

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
		(item) => {
			setSearch('');
			if (isItemSelected(item))
				dispatch(removeFilter(dataSet, dataKey, item.value, item.type));
			else
				dispatch(addFilter(dataSet, dataKey, item.value, item.type));
		},
		[setSearch, isItemSelected, dispatch, dataSet, dataKey]
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
					onClick={() => dispatch(setFilter(dataSet, dataKey, []))}
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

type TableColumnHeaderProps = {
	className?: string;
	style?: React.CSSProperties;
	dataSet: string;
	dataKey: string;
	label?: string;
	dataRenderer?: (value: any) => string;
	anchorEl: HTMLElement | null;
	customFilterElement?: React.ReactNode;
	isId?: boolean;
};

function TableColumnHeader({
	className,
	style,
	dataSet,		// Identifies the dataset in the store
	dataKey,		// Identifies the data element in the row object
	label,			// Column label
	dataRenderer,	// Optional function to render the data element
	anchorEl,
	customFilterElement,	// Custom filter element for dropdown
	isId,			// Identifies the data table ID column; enables "filter selected"
}: TableColumnHeaderProps) {
	const selectInfo = React.useCallback((state) => {
		const sorts = selectSorts(state, dataSet);
		const filter = selectFilter(state, dataSet, dataKey);
		return {
			sort: sorts.settings[dataKey],
			isSorted: sorts.by.includes(dataKey),
			filter: filter,
			isFiltered: filter && filter.comps.length > 0,
		}
	}, [dataSet, dataKey]);

	const {sort, isSorted, filter, isFiltered} = useSelector(selectInfo);

	if (!sort && !filter)
		return <Header><Label>{label}</Label></Header>

	const selectRenderer = ({state, methods}: RendererProps) =>
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
					dataSet={dataSet}
					dataKey={dataKey}
				/>}
			{filter &&
				<FilterComponent
					dataSet={dataSet}
					dataKey={dataKey}
					dataRenderer={dataRenderer}
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
			//anchorEl={anchorEl}
		/>
	)
}

export default TableColumnHeader
