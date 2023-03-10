import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from '@emotion/styled';
import {VariableSizeGrid as Grid} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import AppTableRow, {AppTableRowData} from './AppTableRow';
import TableHeader from './AppTableHeader';
import ColumnHeader from './TableColumnHeader';

import {debounce, getScrollbarSize} from '../lib';

import {
	setSelected,
	setDefaultTablesConfig,
	adjustTableColumnWidth,
	selectEntities,
	selectGetField,
	selectSortedFilteredIds,
	EntityId,
	GetEntityField,
	TablesConfig,
	TableConfig,
	ChangeableColumnProperties
} from '../store/appTableData';

export type {EntityId, GetEntityField};

export type HeaderRendererProps = {
	anchorEl: HTMLElement | null;
	label?: string;
	dataKey: string;
	column: ColumnProperties & ChangeableColumnProperties;
};

export type CellRendererProps = {
	dataKey: string;
	rowId: EntityId;
	rowData: object;
}

export type ColumnProperties = {
	key: string;
	label?: string;
	width?: number;
	flexGrow?: number;
	flexShrink?: number;
	dropdownWidth?: number;
	dataRenderer?: (value: any) => any;
	headerRenderer?: (p: HeaderRendererProps) => React.ReactNode;
	cellRenderer?: (p: CellRendererProps) => React.ReactNode;
};

export type {ChangeableColumnProperties, TablesConfig};

export type RowGetterProps = {
	rowIndex: number;
	rowId: EntityId;
	entities: { [key: string]: object };
	ids: EntityId[];
};

export type AppTableProps<EntityType> = {
	fitWidth?: boolean;
	fixed?: boolean;
	columns: Array<ColumnProperties>,
	dataSet: string;
	rowGetter?: (props: RowGetterProps) => EntityType;
	headerHeight: number;
	estimatedRowHeight: number;
	measureRowHeight?: boolean;
	defaultTablesConfig?: TablesConfig;
	gutterSize?: number,
};

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
		/*padding: 5px 0;*/
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

/*
 * Key down handler for Grid (when focused)
 */
const useKeyDown = (dataSet: string, selected: Array<EntityId>, ids: Array<EntityId>, dispatch: ReturnType<typeof useDispatch>, gridRef: Grid | null) => 
	React.useCallback((event: React.KeyboardEvent) => {

		const selectAndScroll = (i: number) => {
			dispatch(setSelected(dataSet, [ids[i]]));
			if (gridRef)
				gridRef.scrollToItem({rowIndex: i});
		}

		// Ctrl-A selects all
		if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
			dispatch(setSelected(dataSet, ids));
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
	}, [dataSet, selected, ids, dispatch, gridRef]);

const useRowClick = (dataSet: string, selected: Array<EntityId>, ids: Array<EntityId>, dispatch) => 
	React.useCallback(({event, rowIndex}: {event: React.MouseEvent, rowIndex: number}) => {

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
		dispatch(setSelected(dataSet, newSelected));
	}, [dataSet, selected, ids, dispatch]);

type GridSizing = {
	resetIndex: number;
	rowHeights: Array<number>;
};

interface AppTableSizedProps<EntityType> extends AppTableProps<EntityType> {
	height: number;
	width: number;
};

function AppTableSized<EntityType>({
	width,
	height,
	gutterSize = 5,
	estimatedRowHeight,
	measureRowHeight = false,
	dataSet,
	...props
}: AppTableSizedProps<EntityType>) {
	const gridRef = React.useRef<Grid>(null);
	const headerRef = React.useRef<HTMLDivElement>(null);

	const dispatch = useDispatch();

	const gridSizing = React.useRef<GridSizing>({
		resetIndex: 0,
		rowHeights: [],
	});

	const onRowUpdate = React.useMemo(() => debounce(() => {
		const gs = gridSizing.current;
		if (gridRef.current)
			gridRef.current.resetAfterRowIndex(gs.resetIndex, true);
		gs.resetIndex = gs.rowHeights.length;
	}, 0), []);

	const onRowHeightChange = React.useCallback((rowIndex: number, height: number) => {
		const gs = gridSizing.current;
		if (gs.resetIndex > rowIndex)
    		gs.resetIndex = rowIndex;
    	gs.rowHeights[rowIndex] = height;
    	onRowUpdate();
    }, [onRowUpdate]);

	const getRowHeight = React.useCallback(
		(rowIndex: number) => (gridSizing.current.rowHeights[rowIndex] || estimatedRowHeight) + gutterSize,
		[estimatedRowHeight, gutterSize]
	);

	const {defaultTablesConfig, defaultTableView} = React.useMemo(() => {
		let defaultTablesConfig: TablesConfig | undefined = props.defaultTablesConfig;
		if (!defaultTablesConfig) {
			const config: TableConfig = {fixed: props.fixed || false, columns: {}};
			for (const col of props.columns)
				config.columns[col.key] = {unselectable: true, shown: true, width: col.width || 100};
			defaultTablesConfig = {default: config};
		}
		else {
			defaultTablesConfig = {...defaultTablesConfig};
			for (const [view, config] of Object.entries(defaultTablesConfig)) {
				if (typeof config.fixed !== 'boolean') {
					config.fixed = !!props.fixed || false;
				}
				if (typeof config.columns !== 'object') {
					console.warn(`defaultTablesConfig['${view}'] does not include columns object`);
					config.columns = {};
				}
				for (const col of props.columns) {
					if (!config.columns.hasOwnProperty(col.key)) {
						console.warn(`defaultTablesConfig['${view}'] does not include column with key '${col.key}'`);
						config.columns[col.key] = {unselectable: true, shown: true, width: col.width || 100};
					}
				}
			}
		}
		const defaultTableView = Object.keys(defaultTablesConfig)[0];
		return {defaultTablesConfig, defaultTableView}
	}, [props.defaultTablesConfig, props.columns, props.fixed]);

	React.useEffect(() => {
		dispatch(setDefaultTablesConfig(dataSet, defaultTableView, defaultTablesConfig));
	}, [dispatch, dataSet, defaultTableView, defaultTablesConfig]);

	const selectInfo = React.useCallback(state => {
		const {selected, expanded, loading} = state[dataSet];
		const {tablesConfig, tableView} = state[dataSet].ui;
		return {
			selected,
			expanded,
			loading,
			ids: selectSortedFilteredIds(state, dataSet),
			entities: selectEntities(state, dataSet),
			getField: selectGetField(state, dataSet),
			tablesConfig,
			tableView
		}
	}, [dataSet]);

	const {selected, expanded, loading, ids, entities, getField, tablesConfig, tableView} = useSelector(selectInfo);

	const tableConfig = tablesConfig[tableView] || defaultTablesConfig[defaultTableView];

	const adjustColumnWidth = React.useCallback((key: string, deltaX: number) => {
		dispatch(adjustTableColumnWidth(dataSet, tableView, key, deltaX));
		//dispatch(setTableColumnWidth(dataSet, tableView, key, width));
		if (gridRef.current)
			gridRef.current.resetAfterColumnIndex(0, true);
	}, [dispatch, dataSet, tableView]);

	// Sync the table header scroll position with that of the table body
	const onScroll = ({scrollLeft, scrollTop}) => {
		if (headerRef.current)
			headerRef.current.scrollLeft = scrollLeft;
	};

	const onKeyDown = useKeyDown(dataSet, selected, ids, dispatch, gridRef.current);

	const onRowClick = useRowClick(dataSet, selected, ids, dispatch);

	const fixed = tableConfig.fixed;
	const {columns, totalWidth} = React.useMemo(() => {
		const columns: Array<ColumnProperties & ChangeableColumnProperties> = props.columns
			.map(col => ({...col, ...tableConfig.columns[col.key]}))
			.filter(col => col.shown);
		const totalWidth = columns.reduce((totalWidth, col) => totalWidth = totalWidth + col.width, 0);
		return {columns, totalWidth}
	}, 	[props.columns, tableConfig.columns]);

	// If width is not given, then size to content
	if (!width)
		width = totalWidth + scrollbarSize;

	// If the container size changes, then re-render rows
	React.useEffect(() => {
		if (gridRef.current)
			gridRef.current.resetAfterColumnIndex(0, true)
	}, [width, height, fixed]);

	// Package the context data
	const tableData: AppTableRowData = React.useMemo(() => ({
		gutterSize,
		entities,
		ids,
		selected,
		expanded,
		fixed,
		columns,
		getRowData: props.rowGetter,
		getField,
		estimatedRowHeight,
		measureRowHeight,
		onRowHeightChange,
		onRowClick
	}), [props.rowGetter, gutterSize, entities, ids, selected, expanded, fixed, columns, getField, estimatedRowHeight, measureRowHeight, onRowHeightChange, onRowClick]);

	// put header after body and reverse the display order via css to prevent header's shadow being covered by body
	return (
		<Table
			role='table'
			style={{height, width}}
			onKeyDown={onKeyDown}
			tabIndex={0}
		>
			{ids.length?
				<Grid
					ref={gridRef}
					height={height - props.headerHeight}
					width={width}
					columnCount={1}
					columnWidth={() => (fixed? totalWidth: width - scrollbarSize)}
					rowCount={ids.length}
					estimatedRowHeight={estimatedRowHeight}
					rowHeight={getRowHeight}
					onScroll={onScroll}
					itemData={tableData}
				>
					{AppTableRow}
				</Grid>:
				<NoGrid style={{height: height - props.headerHeight, width}}>
					{loading? 'Loading...': 'Empty'}
				</NoGrid>
			}
			<TableHeader
				ref={headerRef}
				outerStyle={{width, height: props.headerHeight, paddingRight: scrollbarSize}}
				innerStyle={{width: fixed? totalWidth + scrollbarSize: '100%'}}
				fixed={fixed}
				columns={columns}
				adjustColumnWidth={adjustColumnWidth}
				defaultHeaderCellRenderer={(p) => <ColumnHeader dataSet={dataSet} {...p}/>}
			/>
		</Table>
	)
}

/*
 * AppTable
 */
export function AppTable<EntityType = object>(props: AppTableProps<EntityType>) {
	return (
		<AutoSizer disableWidth={props.fitWidth} style={{maxWidth: '100vw'}} >
			{({height, width}) => <AppTableSized<EntityType> height={height} width={width} {...props} />}
		</AutoSizer>
	)
}

//export default React.memo(AppTable);
export default AppTable;