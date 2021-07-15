import {createSlice} from '@reduxjs/toolkit'

const initialTableConfig = {fixed: false, columns: {}}

const slice = createSlice({
	name: 'ui',
	initialState: {
  		tableView: 'default',
  		tablesConfig: {}
  	},
  	reducers: {
  		setTableView(state, action) {
  			const {tableView} = action.payload;
			state.tableView = tableView;
  		},
		setDefaultTablesConfig(state, action) {
			const {tablesConfig} = action.payload;
			// Remove table views with no default config
			for (const tableView of Object.keys(state.tablesConfig)) {
				if (!tablesConfig[tableView])
					delete state.tablesConfig[tableView];
			}
			// Add default config if config not already present
			for (const [tableView, tableConfig] of Object.entries(tablesConfig)) {
				if (!state.tablesConfig[tableView])
					state.tablesConfig[tableView] = tableConfig;
			}
			// Set current table view if not set or points to removed config
			if (!state.tableView || !state.tablesConfig[state.tableView]) {
				const {tableView} = action.payload;
				if (tableView)
					state.tableView = tableView;
				else
					state.tableView = Object.keys(state.tablesConfig)[0];
			}
		},
		upsertTableColumns(state, action) {
			let {tableView, columns} = action.payload;
			if (tableView === undefined)
				tableView = state.tableView;
			let tableConfig = state.tablesConfig[tableView];
			if (tableConfig === undefined)
				tableConfig = initialTableConfig; 
			for (const [key, column] of Object.entries(columns)) {
				if (tableConfig.columns[key] === undefined)
					tableConfig.columns[key] = {};
				tableConfig.columns[key] = {...tableConfig.columns[key], ...column}
			}
		},
		adjustTableColumnWidth(state, action) {
			let {tableView, key, delta} = action.payload;
			if (!tableView)
				tableView = state.tableView;
			const tableConfig = state.tablesConfig[tableView];
			const column = tableConfig.columns[key];
			column.width = Math.max(0, column.width + delta);
		},
		toggleTableFixed(state, action) {
			let {tableView} = action.payload;
			if (tableView === undefined)
				tableView = state.tableView;
			let tableConfig = state.tablesConfig[tableView];
			if (tableConfig === undefined)
				tableConfig = initialTableConfig;
			tableConfig.fixed = !state.tablesConfig[tableView].fixed;
			state.tablesConfig[tableView] = tableConfig;
		},
		setProperty(state, action) {
			const {property, value} = action.payload;
			state[property] = value;
		}
  	}
});

export default slice;

/* Actions */
export const setDefaultTablesConfig = (dataSet, tableView, tablesConfig) =>
	({type: dataSet + '/' + slice.actions.setDefaultTablesConfig, payload: {tableView, tablesConfig}});
export const setTableView = (dataSet, tableView) => 
	({type: dataSet + '/' + slice.actions.setTableView, payload: {tableView}});
export const toggleTableFixed = (dataSet, tableView) => 
	({type: dataSet + '/' + slice.actions.toggleTableFixed, payload: {tableView}});
export const upsertTableColumns = (dataSet, tableView, columns) => 
	({type: dataSet + '/' + slice.actions.upsertTableColumns, payload: {tableView, columns}});
export const adjustTableColumnWidth = (dataSet, tableView, key, delta) => 
	({type: dataSet + '/' + slice.actions.adjustTableColumnWidth, payload: {tableView, key, delta}});
export const setTableColumnShown = (dataSet, tableView, key, shown) => 
	({type: dataSet + '/' + slice.actions.upsertTableColumns, payload: {tableView, columns: {[key]: {shown}}}});
export const setTableColumnUnselectable = (dataSet, tableView, key, unselectable) => 
	({type: dataSet + '/' + slice.actions.upsertTableColumns, payload: {tableView, columns: {[key]: {unselectable}}}});
export const setProperty = (dataSet, property, value) => 
	({type: dataSet + '/' + slice.actions.setProperty, payload: {property, value}});

