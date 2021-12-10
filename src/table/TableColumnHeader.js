import PropTypes from 'prop-types';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from '@emotion/styled';
import {FixedSizeList as List} from 'react-window';

import {Button, Icon} from '../icons';
import {Checkbox, Input} from '../form';
import Dropdown from '../general/Dropdown'

import {
	selectGetField,
	selectEntities,
	selectIds,
	selectFilteredIds,
	selectSorts, selectSort, sortSet, sortOptions, SortDirection, SortType,
	selectFilter, setFilter, addFilter, removeFilter, FilterType,
	selectSelected
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

const Item = styled.div`
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

function Sort({dataSet, dataKey}) {
	const {direction, type} = useSelector(state => state[dataSet].sorts.settings[dataKey]);
	const dispatch = useDispatch();
	const setSort = React.useCallback((direction) => dispatch(sortSet(dataSet, dataKey, direction)), [dispatch, dataSet, dataKey]);
	return (
		<Row>
			<label>Sort:</label>
			<span>
				<Button
					onClick={e => setSort(direction === SortDirection.ASC? SortDirection.NONE: SortDirection.ASC)}
					isActive={direction === SortDirection.ASC}
				>
					<Icon
						type='sort'
						direction={SortDirection.ASC}
						isAlpha={type !== SortType.NUMERIC}
					/>
				</Button>
				<Button
					onClick={e => setSort(direction === SortDirection.DESC? SortDirection.NONE: SortDirection.DESC)}
					isActive={direction === SortDirection.DESC}
				>
					<Icon
						type='sort'
						direction={SortDirection.DESC}
						isAlpha={type !== SortType.NUMERIC}
					/>
				</Button>
			</span>
		</Row>
	)
}

function Filter({
	dataSet,
	dataKey,
	dataRenderer,
	customFilterElement,
	isId,
}) {
	const [search, setSearch] = React.useState('');
	const inputRef = React.useRef();

	const dispatch = useDispatch();

	const selectSortFilterSelected = React.useCallback(state => ({
		sort: selectSort(state, dataSet, dataKey),
		filter: selectFilter(state, dataSet, dataKey),
		selected: selectSelected(state, dataSet),
	}), [dataSet, dataKey]);

	const {sort, filter, selected} = useSelector(selectSortFilterSelected);

	const selectValues = React.useCallback(state => {
		const filter = selectFilter(state, dataSet, dataKey);
		let ids = selectIds(state, dataSet);
		if (filter.values.length === 0)
			ids = selectFilteredIds(state, dataSet);
		const getField = selectGetField(state, dataSet);
		const entities = selectEntities(state, dataSet);
		return [...new Set(ids.map(id => getField(entities[id], dataKey)))];
	}, [dataSet, dataKey]);

	const values = useSelector(selectValues);

	const options = React.useMemo(() => {
		if (filter.options)
			return filter.options;

		const renderLabel = v => {
			let s = dataRenderer? dataRenderer(v): v;
			if (s === '')
				s = '(Blank)';
			return s;
		}

		return values.map(v => ({value: v, label: renderLabel(v)}));

	}, [values, dataRenderer, filter]);

	let searchItems = filter.values
		.filter(v => v.filterType !== FilterType.EXACT)
		.map(v => ({
			value: v.value,
			label: (v.filterType === FilterType.REGEX? 'Regex: ': 'Contains: ') + v.value.toString(),
			type: v.filterType
		}));

	let exactItems = options.map(o => ({...o, type: FilterType.EXACT}));

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
					value: regexp,
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
		if (search === '//')
			inputRef.current.setSelectionRange(1, 1);
	}, [search]);

	const isItemSelected = React.useCallback(
		(item) => filter.values.find(v => v.value === item.value && v.filterType === item.type) !== undefined,
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
		(e) => {
			if (e.key === 'Enter' && e.target.value)
				toggleItemSelected(items[0]);
			if (e.key === '/' && !e.target.value) {
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
				{selected && isId &&
					<Button
						onClick={() => dispatch(setFilter(dataSet, dataKey, selected))}
						disabled={selected.length === 0}
						isActive={filter.values.map(v => v.value).join() === selected.join()}
					>
						Selected
					</Button>}
				<Button
					onClick={() => dispatch(setFilter(dataSet, dataKey, []))}
					isActive={filter.values.length === 0}
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

Filter.propTypes = {
	dataSet: PropTypes.string.isRequired,
	dataKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	sort: PropTypes.object,
	entities: PropTypes.object,
	dataRenderer: PropTypes.func,
	customFilterElement: PropTypes.element,
	isId: PropTypes.bool,
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

function TableColumnHeader({
	className,
	style,
	dataSet,
	label,
	dataKey,
	dataRenderer,
	dropdownWidth,
	anchorEl,
	customFilterElement,
	isId,
}) {
	const selectInfo = React.useCallback((state) => {
		const sorts = selectSorts(state, dataSet);
		const filter = selectFilter(state, dataSet, dataKey);
		return {
			sort: sorts.settings[dataKey],
			isSorted: sorts.by.includes(dataKey),
			filter: filter,
			isFiltered: filter && filter.values.length > 0,
		}
	}, [dataSet, dataKey]);

	const {sort, isSorted, filter, isFiltered} = useSelector(selectInfo);

	if (!sort && !filter)
		return <Header><Label>{label}</Label></Header>

	const selectRenderer = ({isOpen, open, close}) =>
		<Header
			onClick={isOpen? close: open}
		>
			<Label>{label}</Label>
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
				<Icon type='handle' />
			</div>
		</Header>;

	const dropdownRenderer = ({close}) =>
		<>
			{sort &&
				<Sort
					dataSet={dataSet}
					dataKey={dataKey}
				/>}
			{filter &&
				<Filter
					dataSet={dataSet}
					dataKey={dataKey}
					dataRenderer={dataRenderer}
					customFilterElement={customFilterElement}
					isId={isId}
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
			portal
			anchorEl={anchorEl}
		/>
	)
}

TableColumnHeader.propTypes = {
	dataSet: PropTypes.string.isRequired,	// Identifies the dataset in the store
	dataKey: PropTypes.string.isRequired,	// Identifies the data element in the row object
	label: PropTypes.string.isRequired,		// Column label
	dropdownWidth: PropTypes.number,
	dataRenderer: PropTypes.func,			// Optional function to render the data element
	anchorEl: PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
	customFilterElement: PropTypes.element,	// Custom filter element for dropdown
	isId: PropTypes.bool,					// Identifies the data table ID column; enables "filter selected"
}

export default TableColumnHeader
