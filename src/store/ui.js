
const initialTableConfig = {fixed: false, columns: {}}

const name = 'ui';

export const createUiSubslice = (dataSet) => ({
	name,
	initialState: {ui: {tableView: 'default', tablesConfig: {}}},
	reducers: {
		setProperty(state, action) {
			const ui = state[name];
			const {property, value} = action.payload;
			ui[property] = value;
		},
		setTableView(state, action) {
			const ui = state[name];
  			const {tableView} = action.payload;
			ui.tableView = tableView;
  		},
		setDefaultTablesConfig(state, action) {
			const ui = state[name];
			const {tablesConfig} = action.payload;
			// Remove table views with no default config
			for (const tableView of Object.keys(ui.tablesConfig)) {
				if (!tablesConfig[tableView])
					delete ui.tablesConfig[tableView];
			}
			// Add default config if config not already present
			for (const [tableView, tableConfig] of Object.entries(tablesConfig)) {
				if (!ui.tablesConfig[tableView])
					ui.tablesConfig[tableView] = tableConfig;
			}
			// Set current table view if not set or points to removed config
			if (!ui.tableView || !ui.tablesConfig[state.tableView]) {
				const {tableView} = action.payload;
				if (tableView)
					ui.tableView = tableView;
				else
					ui.tableView = Object.keys(ui.tablesConfig)[0];
			}
		},
		upsertTableColumns(state, action) {
			const ui = state[name];
			let {tableView, columns} = action.payload;
			if (tableView === undefined)
				tableView = ui.tableView;
			let tableConfig = ui.tablesConfig[tableView];
			if (tableConfig === undefined)
				tableConfig = initialTableConfig; 
			for (const [key, column] of Object.entries(columns)) {
				if (tableConfig.columns[key] === undefined)
					tableConfig.columns[key] = {};
				tableConfig.columns[key] = {...tableConfig.columns[key], ...column}
			}
		},
		adjustTableColumnWidth(state, action) {
			const ui = state[name];
			let {tableView, key, delta} = action.payload;
			if (!tableView)
				tableView = ui.tableView;
			const tableConfig = ui.tablesConfig[tableView];
			const column = tableConfig.columns[key];
			column.width = Math.max(0, column.width + delta);
		},
		toggleTableFixed(state, action) {
			const ui = state[name];
			let {tableView} = action.payload;
			if (tableView === undefined)
				tableView = ui.tableView;
			let tableConfig = ui.tablesConfig[tableView];
			if (tableConfig === undefined)
				tableConfig = initialTableConfig;
			tableConfig.fixed = !ui.tablesConfig[tableView].fixed;
			ui.tablesConfig[tableView] = tableConfig;
		},
	}
});

/* Actions */
export const setDefaultTablesConfig = (dataSet, tableView, tablesConfig) =>
	({type: dataSet + '/setDefaultTablesConfig', payload: {tableView, tablesConfig}});
export const setTableView = (dataSet, tableView) => 
	({type: dataSet + '/setTableView', payload: {tableView}});
export const toggleTableFixed = (dataSet, tableView) => 
	({type: dataSet + '/toggleTableFixed', payload: {tableView}});
export const upsertTableColumns = (dataSet, tableView, columns) => 
	({type: dataSet + '/upsertTableColumns', payload: {tableView, columns}});
export const adjustTableColumnWidth = (dataSet, tableView, key, delta) => 
	({type: dataSet + '/adjustTableColumnWidth', payload: {tableView, key, delta}});
export const setTableColumnShown = (dataSet, tableView, key, shown) => 
	({type: dataSet + '/upsertTableColumns', payload: {tableView, columns: {[key]: {shown}}}});
export const setTableColumnUnselectable = (dataSet, tableView, key, unselectable) => 
	({type: dataSet + '/upsertTableColumns', payload: {tableView, columns: {[key]: {unselectable}}}});
export const setProperty = (dataSet, property, value) => 
	({type: dataSet + '/setProperty', payload: {property, value}});

