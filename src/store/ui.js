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
		initTableConfig(state, action) {
			const {tableView, tableConfig} = action.payload;
			state.tablesConfig[tableView] = tableConfig;
		},
		upsertTableColumns(state, action) {
			const {tableView, columns} = action.payload;
			if (!state.tablesConfig[tableView])
				state.tablesConfig[tableView] = initialTableConfig; 
			const tableConfig = state.tablesConfig[tableView]
			for (const key of Object.keys(columns)) {
				if (!tableConfig.columns[key])
					tableConfig.columns[key] = {}
				tableConfig.columns[key] = {...tableConfig.columns[key], ...columns[key]}
			}
		},
		upsertTableColumn(state, action) {
			const {tableView, column} = action.payload;
			if (!state.tablesConfig[tableView])
				state.tablesConfig[tableView] = initialTableConfig; 
			const tableConfig = state.tablesConfig[tableView]
			const key = column.key;
			if (!tableConfig.columns[key])
				tableConfig.columns[key] = {}
			tableConfig.columns[key] = {...tableConfig.columns[key], ...column}
		},
		adjustTableColumnWidth(state, action) {
			const {tableView, key, delta} = action.payload;
			const tableConfig = state.tablesConfig[tableView];
			const column = tableConfig.columns[key];
			column.width = Math.max(0, column.width + delta);
		},
		toggleTableFixed(state, action) {
			const {tableView} = action.payload;
			state.tablesConfig[tableView].fixed = !state.tablesConfig[tableView].fixed;
		},
		setProperty(state, action) {
			const {property, value} = action.payload;
			state[property] = value;
		}
  	}
});

export default slice;

/* Actions */
export const initTableConfig = (dataSet, tableView, tableConfig) => ({type: dataSet + '/' + slice.name + '/initTableConfig', payload: {tableView, tableConfig}})
export const setTableView = (dataSet, tableView) => ({type: dataSet + '/' + slice.name + '/setTableView', payload: {tableView}});
export const toggleTableFixed = (dataSet, tableView) => ({type: dataSet + '/' + slice.name + '/toggleTableFixed', payload: {tableView}});
export const upsertTableColumns = (dataSet, tableView, columns) => ({type: dataSet + '/' + slice.name + '/upsertTableColumns', payload: {tableView, columns}});
export const upsertTableColumn = (dataSet, tableView, column) => ({type: dataSet + '/' + slice.name + '/upsertTableColumn', payload: {tableView, column}});
export const adjustTableColumnWidth = (dataSet, tableView, key, delta) => ({type: dataSet + '/' + slice.name + '/adjustTableColumnWidth', payload: {tableView, key, delta}});
export const setProperty = (dataSet, property, value) => ({type: dataSet + '/' + slice.name + '/setProperty', payload: {property, value}});

