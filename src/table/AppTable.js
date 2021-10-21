import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import styled from '@emotion/styled'
import {VariableSizeGrid as Grid} from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import TableRow from './AppTableRow'
import TableHeader from './AppTableHeader'
import ColumnHeader from './TableColumnHeader'

import {debounce, getScrollbarSize} from '../lib'

import {
	getSelected,
	setSelected,
	getExpanded,
	setDefaultTablesConfig,
	adjustTableColumnWidth,
	getSortedFilteredIds,
} from '../store/appTableData';

const scrollbarSize = getScrollbarSize();

const Table = styled.div`
	position: relative;
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	& * {
		box-sizing: border-box;
	}
	:focus {
		outline: none;
	}
	.AppTable__headerRow,
	.AppTable__dataRow {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: stretch;
		overflow: hidden;
	}
	.AppTable__headerContainer {

	}
	.AppTable__headerRow {
		background-color: #efefef;
	}
	.AppTable__dataRow {
		padding: 5px 0;
	}
	.AppTable__dataRow-even {
		background-color: #fafafa;
	}
	.AppTable__dataRow-odd {
		background-color: #f6f6f6;
	}
	.AppTable__dataRow-selected {
		background-color: #b9b9f7;
	}
	.AppTable__headerCell {
	}
	.AppTable__dataCell {
		padding-right: 10px;
	}
`;

const NoGrid = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1em;
	color: #bdbdbd;
`;

class AppTableSized extends React.PureComponent {

	constructor(props) {
		super(props);

		const {setDefaultTablesConfig, defaultTablesConfig, columns, fixed} = props;
		if (!defaultTablesConfig) {
			const config = {fixed: fixed || false, columns: {}};
			for (const col of columns)
				config.columns[col.key] = {unselectable: true, shown: true, width: col.width || 100};
			this.defaultTablesConfig = {default: config};
		}
		else {
			this.defaultTablesConfig = {...defaultTablesConfig};
			for (const [view, config] of Object.entries(this.defaultTablesConfig)) {
				if (typeof config.fixed !== 'boolean') {
					config.fixed = !!fixed || false;
				}
				if (typeof config.columns !== 'object') {
					console.warn(`defaultTableConfig['${view}'] does not include columns object`);
					config.columns = {};
				}
				for (const col of columns) {
					if (!config.columns.hasOwnProperty(col.key)) {
						console.warn(`defaultTableConfig['${view}'] does not include column with key '${col.key}'`);
						config.columns[col.key] = {unselectable: true, shown: true, width: col.width || 100};
					}
				}
			}
		}
		this.defaultTableView = Object.keys(this.defaultTablesConfig)[0];
		setDefaultTablesConfig(this.defaultTableView, this.defaultTablesConfig);

		this._resetIndex = null;
		this._rowHeightMap = {};
		this._rowHeightMapBuffer = {};
		this.updateRowHeights = debounce(() => {
			this._rowHeightMap = {...this._rowHeightMap, ...this._rowHeightMapBuffer};
			this._rowHeightMapBuffer = {};
			if (this.gridRef)
				this.gridRef.resetAfterRowIndex(this._resetIndex, true);
			this._resetIndex = null;
		}, 0);
	}

	componentDidUpdate(prevProps, prevState) {
		const tableConfig = this.props.tableConfig || this.defaultTablesConfig[this.defaultTableView];
		const prevTableConfig = prevProps.tableConfig || this.defaultTablesConfig[this.defaultTableView];
		if (this.gridRef &&
			(prevProps.width !== this.props.width || prevTableConfig.fixed !== tableConfig.fixed))
			this.gridRef.resetAfterColumnIndex(0, true);
	}

	adjustColumnWidth = async (key, deltaX) => {
		const {adjustTableColumnWidth} = this.props;
		await adjustTableColumnWidth(key, deltaX);
		if (this.gridRef)
			this.gridRef.resetAfterColumnIndex(0, true);
	}

    onRowHeightChange = (rowIndex, height) => {
    	if (this._resetIndex === null || this._resetIndex > rowIndex)
    		this._resetIndex = rowIndex;
    	this._rowHeightMapBuffer = {...this._rowHeightMapBuffer, [rowIndex]: height};
    	this.updateRowHeights();
    }

    getRowHeight = (rowIndex) => this._rowHeightMap[rowIndex] || this.props.estimatedRowHeight;

    // Sync the table header scroll position with that of the table body
	handleScroll = ({scrollLeft, scrollTop}) => {if (this.headerRef) this.headerRef.scrollLeft = scrollLeft};

	handleKeyDown = (event) => {
		const {ids, selected, setSelected} = this.props;

		if (!selected)
			return;

		const selectAndScroll = (i) => {
			setSelected([ids[i]]);
			if (this.gridRef)
				this.gridRef.scrollToItem({rowIndex: i});
		}

		// Ctrl-A selects all
		if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
			setSelected(ids);
			event.preventDefault();
		}
		else if (event.key === 'Home') {
			if (ids.length)
				selectAndScroll(0);
		}
		else if (event.key === 'End') {
			if (ids.length)
				selectAndScroll(ids.length - 1);
		}
		else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {

			if (selected.length === 0) {
				if (ids.length > 0)
					selectAndScroll(0);
				return;
			}

			let id = selected[0];
			let i = ids.indexOf(id);
			if (i === -1) {
				if (ids.length > 0)
					selectAndScroll(0);
				return;
			}

			if (event.key === 'ArrowUp') {
				if (i === 0)
					i = ids.length - 1;
				else
					i = i - 1;
			}
			else {	// Down arrow
				if (i === (ids.length - 1))
					i = 0;
				else
					i = i + 1;
			}

			selectAndScroll(i);
		}
	}

	handleClick = ({event, rowIndex, rowData}) => {
		const {ids, selected, setSelected} = this.props;

		if (!selected)
			return;

		let newSelected = selected.slice();
		const id = ids[rowIndex];
		if (event.shiftKey) {
			// Shift + click => include all between last and current
			if (newSelected.length === 0) {
				newSelected.push(id);
			}
			else {
				const id_last = newSelected[newSelected.length - 1];
				const i_last = ids.indexOf(id_last);
				const i_selected = ids.indexOf(id);
				if (i_last >= 0 && i_selected >= 0) {
					if (i_last > i_selected) {
						for (let i = i_selected; i < i_last; i++) {
							newSelected.push(ids[i]);
						}
					}
					else {
						for (let i = i_last + 1; i <= i_selected; i++) {
							newSelected.push(ids[i]);
						}
					}
				}
			}
		}
		else if (event.ctrlKey || event.metaKey) {
			// Control + click => add or remove
			if (newSelected.includes(id))
				newSelected = newSelected.filter(s => s !== id);
			else
				newSelected.push(id);
		}
		else {
			newSelected = [id];
		}
		setSelected(newSelected);
	}

	render() {
		const {props} = this;

		const tableConfig = props.tableConfig || this.defaultTablesConfig[this.defaultTableView];
		if (typeof tableConfig.columns !== 'object') {
			console.warn('Bad tableConfig: ', tableConfig)
			return null;
		}
		const fixed = tableConfig.fixed;
		const columns = props.columns
			.map(col => ({...col, ...tableConfig.columns[col.key]}))
			.filter(col => col.shown);

		const totalWidth = columns.reduce((totalWidth, col) => totalWidth = totalWidth + col.width, 0);

		let {width, height} =  props;
		if (!width) {
			// If width is not given, then size to content
			width = totalWidth + scrollbarSize;
		}
		const containerWidth = width;

		// put header after body and reverse the display order via css
		// to prevent header's shadow being covered by body
		return (
			<Table
				role='table'
				style={{height, width: containerWidth}}
				onKeyDown={this.handleKeyDown}
				tabIndex={0}
			>
				{props.ids.length?
					<Grid
						ref={ref => this.gridRef = ref}
						height={height - props.headerHeight}
						width={width}
						columnCount={1}
						columnWidth={() => (fixed? totalWidth: width - scrollbarSize)}
						rowCount={props.ids.length}
						estimatedRowHeight={props.estimatedRowHeight}
						rowHeight={this.getRowHeight}
						onScroll={this.handleScroll}
					>
						{({rowIndex, style}) => {
							const rowId = props.ids[rowIndex];
							const rowData = props.rowGetter 
								? props.rowGetter({rowIndex, rowId, ids: props.ids, entities: props.entities})
								: props.entities[rowId];
								
							//console.log(rowData)
							const isSelected = props.selected && props.selected.includes(rowId);
							const isExpanded = props.expanded && props.expanded.includes(rowId);

							// Add appropriate row classNames
							let classNames = ['AppTable__dataRow'];
							classNames.push((rowIndex % 2 === 0)? 'AppTable__dataRow-even': 'AppTable__dataRow-odd');
							if (isSelected)
								classNames.push('AppTable__dataRow-selected');

							return (
								<TableRow
									key={rowId}
									className={classNames.join(' ')}
									style={style}
									fixed={fixed}
									columns={columns}
									rowIndex={rowIndex}
									rowId={rowId}
									rowData={rowData}
									isExpanded={isExpanded}
									estimatedRowHeight={props.estimatedRowHeight}
									onRowHeightChange={this.onRowHeightChange}
									onRowClick={this.handleClick}
								/>
							)
						}}
					</Grid>:
					<NoGrid style={{height: height - props.headerHeight, width}}>
						{props.loading? 'Loading...': 'Empty'}
					</NoGrid>
				}
				<TableHeader
					ref={ref => this.headerRef = ref}
					outerStyle={{width, height: props.headerHeight, paddingRight: scrollbarSize}}
					innerStyle={{width: fixed? totalWidth + scrollbarSize: '100%'}}
					fixed={fixed}
					columns={columns}
					setColumnWidth={this.adjustColumnWidth}
					defaultHeaderCellRenderer={(p) => <ColumnHeader dataSet={props.dataSet} {...p}/>}
				/>
			</Table>
		)
	}
}

/*
 * AppTable
 */
function _AppTable(props) {
	return (
		<AutoSizer disableWidth={props.fitWidth} style={{maxWidth: '100vw'}} >
			{({height, width}) => <AppTableSized height={height} width={width} {...props} />}
		</AutoSizer>
	)
}

_AppTable.propTypes = {
	fitWidth: PropTypes.bool,
	fixed: PropTypes.bool,
	columns: PropTypes.array.isRequired,
	dataSet: PropTypes.string.isRequired,
	selected: PropTypes.array,
	expanded: PropTypes.array,
	rowGetter: PropTypes.func,
	headerHeight: PropTypes.number.isRequired,
	estimatedRowHeight: PropTypes.number.isRequired,
	loading: PropTypes.bool.isRequired,
}

const AppTable = connect(
	(state, ownProps) => {
		const {dataSet} = ownProps;
		const {tableView, tablesConfig} = state[dataSet].ui;
		const tableConfig = tablesConfig[tableView];
		return {
			selected: getSelected(state, dataSet),
			expanded: getExpanded(state, dataSet),
			loading: state[dataSet].loading,
			entities: state[dataSet].entities,
			ids: getSortedFilteredIds(state, dataSet),
			tableView,
			tableConfig,
		}
	},
	(dispatch, ownProps) => {
		const {dataSet} = ownProps;
		return {
			setSelected: ids => dispatch(setSelected(dataSet, ids)),
			adjustTableColumnWidth: (key, delta) => dispatch(adjustTableColumnWidth(dataSet, undefined, key, delta)),
			setDefaultTablesConfig: (tableView, tablesConfig) => dispatch(setDefaultTablesConfig(dataSet, tableView, tablesConfig)),
		}
	}
)(_AppTable)

AppTable.propTypes = {
	dataSet: PropTypes.string.isRequired,
	defaultTablesConfig: PropTypes.object,
	fitWidth: PropTypes.bool,
	fixed: PropTypes.bool,
	columns: PropTypes.array.isRequired,
	rowGetter: PropTypes.func,
	headerHeight: PropTypes.number.isRequired,
	estimatedRowHeight: PropTypes.number.isRequired,
}

export default AppTable;
