import type { PayloadAction } from '@reduxjs/toolkit';

export type ChangeableColumnProperties = {
	width: number;
	shown: boolean;
	unselectable?: boolean;
};

export type TableConfig = { fixed: boolean; columns: { [key: string]: ChangeableColumnProperties } };
export type TablesConfig = { [tableView: string]: TableConfig };

export type PanelConfig = { width: number, isSplit: boolean };
export type PanelsConfig = { [tableView: string]: PanelConfig };

export type UiProperty = { property: string; value: any };
export type UiProperties = { [property: string]: any };

const defaultColumnProperties: ChangeableColumnProperties = {
	width: 100,
	shown: false,
	unselectable: false
};

const defaultTableView = 'default';
const defaultTableConfig: TableConfig = {fixed: false, columns: {}};
const defaultPanelConfig: PanelConfig = {width: 0.5, isSplit: false};

const name = 'ui';

export type UiState = { [name]: {
		tableView: string;
		tablesConfig: TablesConfig;
		panelsConfig: PanelsConfig;
		[property: string]: any;
	};
};

export const createUiSubslice = (dataSet: string) => {
	const initialUiState = {
		tableView: defaultTableView,
		tablesConfig: {[defaultTableView]: defaultTableConfig},
		panelsConfig: {[defaultTableView]: defaultPanelConfig}
	};
	const initialState = { [name]: initialUiState };

	return {
		name,
		initialState,
		reducers: {
			setProperty(state: UiState, action: PayloadAction<UiProperty>) {
				const ui = state[name];
				const {property, value} = action.payload;
				ui[property] = value;
			},
			setUiProperties(state: UiState, action: PayloadAction<UiProperties>) {
				state[name] = {...state[name], ...action.payload};
			},
			setTableView(state: UiState, action: PayloadAction<{tableView: string}>) {
				const ui = state[name];
				const {tableView} = action.payload;
				ui.tableView = tableView;
			},
			setDefaultTablesConfig(state: UiState, action: PayloadAction<{tableView: string; tablesConfig: TablesConfig}>) {
				const ui = state[name];
				const {tablesConfig} = action.payload;
				// Remove table views with no default config
				for (const tableView of Object.keys(ui.tablesConfig)) {
					if (!tablesConfig[tableView]) {
						delete ui.tablesConfig[tableView];
						delete ui.panelsConfig[tableView];
					}
				}
				// Add default config if config not already present
				for (const [tableView, tableConfig] of Object.entries(tablesConfig)) {
					if (!ui.tablesConfig[tableView]) {
						ui.tablesConfig[tableView] = tableConfig;
					}
					else {
						const existingTableConfig = ui.tablesConfig[tableView];
						// Remove columns that no longer exist
						for (const colKey of Object.keys(existingTableConfig.columns)) {
							if (!tableConfig.columns[colKey])
								delete existingTableConfig.columns[colKey];
						}
						// Add columns that aren't currently present
						for (const colKey of Object.keys(tableConfig.columns)) {
							if (!existingTableConfig.columns[colKey])
								existingTableConfig.columns[colKey] = tableConfig.columns[colKey];
						}
					}
					if (!ui.panelsConfig[tableView])
						ui.panelsConfig[tableView] = defaultPanelConfig;
				}
				// Set current table view if not set or points to removed config
				if (!ui.tableView || !ui.tablesConfig[ui.tableView]) {
					const {tableView} = action.payload;
					if (tableView)
						ui.tableView = tableView;
					else
						ui.tableView = Object.keys(ui.tablesConfig)[0];
				}
			},
			upsertTableColumns(state: UiState, action: PayloadAction<{tableView: string | undefined; columns: Array<ChangeableColumnProperties>}>) {
				const ui = state[name];
				let {tableView, columns} = action.payload;
				if (tableView === undefined)
					tableView = ui.tableView;
				let tableConfig = ui.tablesConfig[tableView];
				if (tableConfig === undefined)
					tableConfig = defaultTableConfig;
				for (const [key, column] of Object.entries(columns)) {
					if (tableConfig.columns[key] === undefined)
						tableConfig.columns[key] = defaultColumnProperties;
					tableConfig.columns[key] = {...tableConfig.columns[key], ...column}
				}
			},
			adjustTableColumnWidth(state: UiState, action: PayloadAction<{tableView: string; key: string; delta: number}>) {
				const ui = state[name];
				let {tableView, key, delta} = action.payload;
				if (!tableView)
					tableView = ui.tableView;
				const tableConfig = ui.tablesConfig[tableView];
				const column = tableConfig.columns[key];
				column.width = Math.max(0, column.width + delta);
			},
			setTableColumnWidth(state: UiState, action: PayloadAction<{tableView: string; key: string; width: number}>) {
				const ui = state[name];
				let {tableView, key, width} = action.payload;
				if (!tableView)
					tableView = ui.tableView;
				const tableConfig = ui.tablesConfig[tableView];
				const column = tableConfig.columns[key];
				column.width = Math.max(0, width);
			},
			toggleTableFixed(state: UiState, action: PayloadAction<{tableView: string; fixed: boolean}>) {
				const ui = state[name];
				let {tableView} = action.payload;
				if (tableView === undefined)
					tableView = ui.tableView;
				let tableConfig = ui.tablesConfig[tableView];
				if (tableConfig === undefined)
					tableConfig = defaultTableConfig;
				tableConfig.fixed = !ui.tablesConfig[tableView].fixed;
				ui.tablesConfig[tableView] = tableConfig;
			},
			adjustPanelWidth(state: UiState, action: PayloadAction<{tableView: string; delta: number}>) {
				const ui = state[name];
				let {tableView, delta} = action.payload;
				if (!tableView)
					tableView = ui.tableView;
				const panelConfig = ui.panelsConfig[tableView];
				panelConfig.width += delta;
			},
			setPanelWidth(state: UiState, action: PayloadAction<{tableView: string | undefined; width: number}>) {
				const ui = state[name];
				let {tableView, width} = action.payload;
				if (!tableView)
					tableView = ui.tableView;
				const panelConfig = ui.panelsConfig[tableView];
				panelConfig.width = width;
			},
			setPanelIsSplit(state: UiState, action: PayloadAction<{tableView: string; isSplit: boolean}>) {
				const ui = state[name];
				let {tableView, isSplit} = action.payload;
				if (!tableView)
					tableView = ui.tableView;
				const panelConfig = ui.panelsConfig[tableView];
				panelConfig.isSplit = isSplit;
			},
		}
	}
};

/*
 * Selectors
 */
export const selectCurrentView = (state: any, dataSet: string): string => state[dataSet].ui.tableView;

export const selectCurrentPanelConfig = (state, dataSet: string): PanelConfig => {
	const {tableView, panelsConfig} = state[dataSet].ui;
	if (panelsConfig) {
		const panelConfig = panelsConfig[tableView];
		if (panelConfig)
			return panelConfig;
	}
	return defaultPanelConfig;
}

export const selectCurrentTableConfig = (state: any, dataSet: string): TableConfig => {
	const {tableView, tablesConfig} = state[dataSet].ui;
	if (tablesConfig) {
		const tableConfig = tablesConfig[tableView];
		if (tableConfig)
			return tableConfig;
	}
	return defaultTableConfig;
}

export const selectViews = (state: any, dataSet: string): Array<string> => Object.keys(state[dataSet].ui.tablesConfig);


/* Actions */
export const setDefaultTablesConfig = (dataSet: string, tableView: string | undefined, tablesConfig: TablesConfig) =>
	({type: dataSet + '/setDefaultTablesConfig', payload: {tableView, tablesConfig}});
export const setTableView = (dataSet: string, tableView: string) => 
	({type: dataSet + '/setTableView', payload: {tableView}});
export const toggleTableFixed = (dataSet: string, tableView: string) => 
	({type: dataSet + '/toggleTableFixed', payload: {tableView}});
export const upsertTableColumns = (dataSet: string, tableView: string, columns: Array<ChangeableColumnProperties>) => 
	({type: dataSet + '/upsertTableColumns', payload: {tableView, columns}});
export const adjustTableColumnWidth = (dataSet: string, tableView, key: string, delta: number) => 
	({type: dataSet + '/adjustTableColumnWidth', payload: {tableView, key, delta}});
export const setTableColumnWidth = (dataSet: string, tableView: string | undefined, key: string, width: number) => 
	({type: dataSet + '/setTableColumnWidth', payload: {tableView, key, width}});
export const setTableColumnShown = (dataSet: string, tableView: string | undefined, key: string, shown: boolean) => 
	({type: dataSet + '/upsertTableColumns', payload: {tableView, columns: {[key]: {shown}}}});
export const setTableColumnUnselectable = (dataSet: string, tableView: string | undefined, key: string, unselectable: boolean) => 
	({type: dataSet + '/upsertTableColumns', payload: {tableView, columns: {[key]: {unselectable}}}});

export const adjustPanelWidth = (dataSet: string, tableView: string | undefined, delta: number) => 
	({type: dataSet + '/adjustPanelWidth', payload: {tableView, delta}});
export const setPanelWidth = (dataSet: string, tableView: string | undefined, width: number) => 
	({type: dataSet + '/setPanelWidth', payload: {tableView, width}});
export const setPanelIsSplit = (dataSet: string, tableView: string | undefined, isSplit: boolean) => 
	({type: dataSet + '/setPanelIsSplit', payload: {tableView, isSplit}});

export const setProperty = (dataSet: string, property, value: any) => 
	({type: dataSet + '/setProperty', payload: {property, value}});
