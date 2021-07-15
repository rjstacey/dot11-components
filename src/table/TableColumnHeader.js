import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import styled from '@emotion/styled'
import {FixedSizeList as List} from 'react-window'

import {Button, ActionButtonSort, Handle, IconSort, IconFilter} from '../lib/icons'
import {Checkbox, Input} from '../general/Form'
import Dropdown from '../general/Dropdown'

import {getAllFieldValues, getAvailableFieldValues} from '../store/dataSelectors'
import {getSort, sortSet, sortOptions, SortDirection, SortType} from '../store/sort'
import {getFilter, setFilter, addFilter, removeFilter, FilterType} from '../store/filters'
import {getSelected} from '../store/selected'

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

function Sort({
	sort,
	setSort
}) {
	const {direction, type} = sort;
	return (
		<Row>
			<label>Sort:</label>
			<span>
				<ActionButtonSort
					onClick={e => setSort(direction === SortDirection.ASC? SortDirection.NONE: SortDirection.ASC)}
					direction={SortDirection.ASC}
					isAlpha={type !== SortType.NUMERIC}
					isActive={direction === SortDirection.ASC}
				/>
				<ActionButtonSort
					onClick={e => setSort(direction === SortDirection.DESC? SortDirection.NONE: SortDirection.DESC)}
					direction={SortDirection.DESC}
					isAlpha={type !== SortType.NUMERIC}
					isActive={direction === SortDirection.DESC}
				/>
			</span>
		</Row>
	)
}

Sort.propTypes = {
	sort: PropTypes.object.isRequired,
	setSort: PropTypes.func.isRequired
}

function Filter({
	rowKey,
	dataKey,
	sort,
	filter,
	setFilter,
	addFilter,
	removeFilter,
	allValues,
	availableValues,
	selected,
	dataRenderer,
	customFilterElement
}) {
	const [search, setSearch] = React.useState('');
	const inputRef = React.useRef();

	React.useEffect(() => {
		if (search === '//')
			inputRef.current.setSelectionRange(1, 1)
	}, [search]);

	const onInputKey = e => {
		if (e.key === 'Enter' && e.target.value)
			toggleItemSelected(items[0])
		if (e.key === '/' && !e.target.value) {
			// If search is empty and / is pressed, then add // to search
			// and position the cursor between the slashes (through useEffect on search change)
			e.preventDefault();
			setSearch('//');
		}
	}

	const isItemSelected = (item) => 
		filter.values.find(v => v.value === item.value && v.filterType === item.type) !== undefined

	const toggleItemSelected = (item) => {
		setSearch('');
		if (isItemSelected(item))
			removeFilter(item.value, item.type)
		else
			addFilter(item.value, item.type)
	}


	const values = filter.values.length > 0? allValues: availableValues;
	const renderLabel = v => {
		let s = dataRenderer? dataRenderer(v): v;
		if (s === '')
			s = '(Blank)'
		return s;
	}
	const options = filter.options?
		filter.options:
		values.map(v => ({value: v, label: renderLabel(v)}));
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
				exactItems = exactItems.filter(item => regexp.test(item.label))
				let item = {
					label: 'Regex: ' + regexp.toString(),
					value: regexp,
					type: FilterType.REGEX
				}
				searchItems.unshift(item)
			}
		}
		else {
			regexp = new RegExp(search, 'i');
			exactItems = exactItems.filter(item => regexp.test(item.label))
			let item = {
				label: 'Contains: ' + search,
				value: search,
				type: FilterType.CONTAINS
			}
			searchItems.unshift(item)
		}
	}

	if (sort)
		exactItems = sortOptions(sort, exactItems)

	// Regex items at the top of the list
	const items = searchItems.concat(exactItems);

	const itemHeight = 35;
	const listHeight = Math.min(items.length * itemHeight, 200);

	return (
		<>
			<Row>
				<label>Filter:</label>
				{selected && dataKey === rowKey &&
					<Button
						onClick={() => setFilter(selected)}
						disabled={selected.length === 0}
						isActive={filter.values.map(v => v.value).join() === selected.join()}
					>
						Selected
					</Button>}
				<Button
					onClick={() => setFilter([])}
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
	dataKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	sort: PropTypes.object,
	filter: PropTypes.object.isRequired,
	setFilter: PropTypes.func.isRequired,
	addFilter: PropTypes.func.isRequired,
	removeFilter: PropTypes.func.isRequired,
	allValues: PropTypes.array.isRequired,
	availableValues: PropTypes.array.isRequired,
	selected: PropTypes.array,
	dataRenderer: PropTypes.func,
	customFilterElement: PropTypes.element,
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

function _TableColumnHeader({
	className,
	style,
	label,
	dropdownWidth,
	rowKey,
	dataKey,
	sort,
	setSort,
	filter,
	setFilter,
	addFilter,
	removeFilter,
	allValues,
	availableValues,
	dataSet,
	selected,
	dataRenderer,
	column,
	anchorEl,
	customFilterElement
}) {
	const isFiltered = filter && filter.values.length > 0;
	const isSorted = sort && sort.direction !== SortDirection.NONE;

	if (!sort && !filter)
		return <Header><Label>{label}</Label></Header>

	const selectRenderer = ({isOpen, open, close}) =>
		<Header
			onClick={isOpen? close: open}
		>
			<Label>{label}</Label>
			<div className='handle'>
				{isFiltered &&
					<IconFilter
						style={{opacity: 0.2}}
					/>}
				{isSorted && 
					<IconSort
						style={{opacity: 0.2, paddingRight: 4}}
						direction={sort.direction}
						isAlpha={sort.type !== SortType.NUMERIC}
					/>}
				<Handle />
			</div>
		</Header>;

	const dropdownRenderer = ({close}) =>
		<>
			{sort &&
				<Sort
					sort={sort}
					setSort={setSort}
				/>}
			{filter &&
				<Filter
					rowKey={rowKey}
					dataKey={dataKey}
					selected={selected}
					sort={sort}
					filter={filter}
					setFilter={setFilter}
					addFilter={addFilter}
					removeFilter={removeFilter}
					allValues={allValues}
					availableValues={availableValues}
					dataRenderer={dataRenderer}
					customFilterElement={customFilterElement}
				/>}
		</>;

	if (!anchorEl)
		return null;

	return (
		<Dropdown
			selectRenderer={selectRenderer}
			dropdownRenderer={dropdownRenderer}
			portal
			anchorEl={anchorEl}
		/>
	)
}

_TableColumnHeader.propTypes = {
	sort: PropTypes.object,
	filter: PropTypes.object,
	selected: PropTypes.array.isRequired,
	allValues: PropTypes.array.isRequired,
	availableValues: PropTypes.array.isRequired,
	setFilter: PropTypes.func.isRequired,
	addFilter: PropTypes.func.isRequired,
	removeFilter: PropTypes.func.isRequired,
	setSort: PropTypes.func.isRequired,
}

const TableColumnHeader = connect(
	(state, ownProps) => {
		const {dataSet, dataKey} = ownProps
		return {
			sort: getSort(state, dataSet, dataKey),
			filter: getFilter(state, dataSet, dataKey),
			selected: getSelected(state, dataSet),
			allValues: getAllFieldValues(state, dataSet, dataKey),
			availableValues: getAvailableFieldValues(state, dataSet, dataKey)
		}
	},
	(dispatch, ownProps) => {
		const {dataSet, dataKey} = ownProps
		return {
			setFilter: (values) => dispatch(setFilter(dataSet, dataKey, values)),
			addFilter: (value, filterType) => dispatch(addFilter(dataSet, dataKey, value, filterType)),
			removeFilter: (value, filterType) => dispatch(removeFilter(dataSet, dataKey, value, filterType)),
			setSort: (direction) => dispatch(sortSet(dataSet, dataKey, direction)),
		}
	}
)(_TableColumnHeader);

TableColumnHeader.propTypes = {
	dataSet: PropTypes.string.isRequired,
	dataKey: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	column: PropTypes.object.isRequired,
	dropdownWidth: PropTypes.number,
	anchorEl: PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
}

export default TableColumnHeader
