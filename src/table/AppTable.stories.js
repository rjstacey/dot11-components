import { LoremIpsum } from "lorem-ipsum";
import React from 'react';
import { configureStore, combineReducers, createEntityAdapter } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { Provider, useDispatch, useSelector } from 'react-redux'

import {displayDate} from '../lib/utils'
import {appTableCreateSlice} from '../store/appTableData'
import {SortType} from '../store/sort'
import {initTableConfig} from '../store/ui'

import AppTable, {SelectHeader, SelectCell, SelectExpandHeader, SelectExpandCell, DataColumnHeader, ColumnSelector, ShowFilters, IdSelector, IdFilter} from '.'

const statusOptions = [
	{value: 0, label: 'Good'},
	{value: 1, label: 'Bad'},
	{value: 2, label: 'Ugly'}
];

const renderStatus = (v) => {
	const o = statusOptions.find(o => o.value === v);
	return o? o.label: v;
}

const fields = {
	id: {label: 'ID'},
	Name: {label: 'Name'},
	Date: {
		label: 'Date',
		dataRenderer: displayDate,
		sortType: SortType.DATE
	},
	Text: {label: 'Text'},
	Number: {
		label: 'Number',
		sortType: SortType.NUMERIC
	},
	Status: {
		label: 'Status',
		dataRenderer: renderStatus,
		options: statusOptions,
		sortType: SortType.NUMERIC
	},
};

const dataAdapter = createEntityAdapter({});

const dataSet = 'data';

const slice = appTableCreateSlice({
	name: dataSet,
	fields,
	initialState: dataAdapter.getInitialState({
		valid: false,
		loading: false
	}),
	reducers: {
		getPending(state, action) {
			state.loading = true;
		},
		getSuccess(state, action) {
			state.loading = false;
			state.valid = true;
			dataAdapter.setAll(state, action.payload);
		},
		getFailure(state, action) {
			state.loading = false;
		},
	}
});

const store = configureStore({
  reducer: combineReducers({
  	[slice.name]: slice.reducer
  }),
  middleware: [thunk, createLogger({collapsed: true})],
  devTools: true
});

const tableColumns = [
	{key: '__ctrl__',
		width: 48, flexGrow: 0, flexShrink: 0},
	{key: 'id', 
		...fields.id,
		width: 80, flexGrow: 1, flexShrink: 1, dropdownWidth: 200,
		headerRenderer: p =>
			<DataColumnHeader
				dataSet={dataSet}
				customFilterElement=<IdFilter dataSet={dataSet} dataKey='id' />
				{...p}
			/>
	},
	{key: 'Name', 
		...fields.Name,
		width: 80, flexGrow: 1, flexShrink: 1, dropdownWidth: 200},
	{key: 'Date',
		...fields.Date,
		width: 200, flexGrow: 1, flexShrink: 1},
	{key: 'Text',
		...fields.Text,
		width: 200, flexGrow: 1, flexShrink: 1},
	{key: 'Number',
		...fields.Number,
		width: 200, flexGrow: 1, flexShrink: 1},
	{key: 'Status',
		...fields.Status,
		width: 200, flexGrow: 1, flexShrink: 1},
];

const randomDate = (start, end) =>
	new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const randomStatus = () => Math.round(Math.random() * 2);

const lorem = new LoremIpsum({
  sentencesPerParagraph: {max: 8, min: 4},
  wordsPerSentence: {max: 16, min: 4}
});

const genData = () =>
	new Array(1000)
		.fill(true)
		.map((r, i) => ({
			id: i,
			Name: Math.random().toString(36).slice(2),
			Date: randomDate(new Date(2010, 0, 1), new Date()),
			Number: Math.round(Math.random() * 5),
			Text: lorem.generateSentences(3),
			Status: randomStatus()
		}));

const loadData = () =>
	async (dispatch, getState) => {
		const {getPending, getSuccess} = slice.actions;
		if (getState()[dataSet].loading)
			return;
		dispatch(getPending());
		const data = genData();
		setTimeout(() => dispatch(getSuccess(data)), 1000)
	}

const defaultTablesConfig = {
	default: {
		fixed: false,
		columns: ['id', 'Name', 'Date', 'Text', 'Number', 'Status']
	}
}

const LoaderButton = (props) => {
	const dispatch = useDispatch();

	return <button onClick={() => dispatch(loadData())} {...props}>Loader...</button>
}

const Table = ({expandable}) => {

	const dispatch = useDispatch();
	const tablesConfig = useSelector((state) => state[dataSet].ui.tablesConfig);

	React.useEffect(() => {
		for (const tableView of Object.keys(defaultTablesConfig)) {
			const tableConfig = tablesConfig[tableView];
			if (tableConfig)
				continue;
			const columns = tableColumns.reduce((cols, c) => {
				cols[c.key] = {
					visible: c.key.startsWith('__') || defaultTablesConfig[tableView].columns.includes(c.key),
					width: c.width
				}
				return cols;
			}, {});
			const newTableConfig = {
				fixed: defaultTablesConfig[tableView].fixed,
				columns
			}
			dispatch(initTableConfig(dataSet, tableView, newTableConfig));
		}
	}, []);

	const columns = React.useMemo(() => {

		const columns = tableColumns.slice();
		let headerRenderer, cellRenderer;
		if (expandable) {
			headerRenderer = p =>
				<SelectExpandHeader
					dataSet={dataSet}
					customSelectorElement=<IdSelector style={{width: '200px'}} dataSet={dataSet} focusOnMount />
					{...p}
				/>;
			cellRenderer = p => <SelectExpandCell dataSet={dataSet} {...p} />;
		}
		else {
			headerRenderer = p =>
				<SelectHeader
					dataSet={dataSet}
					customSelectorElement=<IdSelector style={{width: '200px'}} dataSet={dataSet} focusOnMount />
					{...p}
				/>;
			cellRenderer = p => <SelectCell dataSet={dataSet} {...p} />;
		}
		columns[0] = {...columns[0], headerRenderer, cellRenderer};

		return columns;
	}, [expandable]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
			<div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
				<LoaderButton />
				<ColumnSelector dataSet={dataSet} columns={columns} />
			</div>
			<ShowFilters dataSet={dataSet} fields={fields} />
			<div style={{width: '100%', flex: 1}}>
				<AppTable
					fixed={false}
					columns={columns}
					headerHeight={46}
					estimatedRowHeight={50}
					dataSet={dataSet}
					rowKey='id'
				/>
			</div>
		</div>
	)
}

export default {
	title: 'Table',
	component: AppTable,
	argTypes: {
		expandable: {
			type: {name: 'boolean'},
		}
	}
};

export const Table1 = (props) =>
	<Provider store={store}>
		<Table {...props} />
	</Provider>
