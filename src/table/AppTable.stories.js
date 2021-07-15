import { LoremIpsum } from "lorem-ipsum";
import React from 'react';
import { configureStore, combineReducers, createEntityAdapter } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { Provider, useDispatch } from 'react-redux'

import {displayDate} from '../lib/utils'
import {ButtonGroup, Button, ActionButton} from '../lib/icons'
import {appTableCreateSlice} from '../store/appTableData'
import {SortType} from '../store/sort'

import AppTable, {
	SelectHeader, 
	SelectCell, 
	SelectExpandHeader,
	SelectExpandCell,
	TableColumnHeader,
	TableViewSelector,
	TableColumnSelector,
	ShowFilters,
	IdSelector,
	IdFilter,
} from '.'
import SplitPanel, {Panel} from './SplitPanel'

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
	Text: {
		label: 'Text',
		dontFilter: true
	},
	Number: {
		label: 'Number',
		sortType: SortType.NUMERIC
	},
	Status: {
		label: 'Status',
		dataRenderer: renderStatus,
		options: statusOptions,
		sortType: SortType.NUMERIC,
		dontSort: true,
		dontFilter: true
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
			<TableColumnHeader
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

const genData = (n) =>
	new Array(n)
		.fill(true)
		.map((r, i) => ({
			id: i,
			Name: Math.random().toString(36).slice(2),
			Date: randomDate(new Date(2010, 0, 1), new Date()),
			Number: Math.round(Math.random() * 5),
			Text: lorem.generateSentences(3),
			Status: randomStatus()
		}));

const loadData = (n = 1000) =>
	async (dispatch, getState) => {
		const {getPending, getSuccess} = slice.actions;
		if (getState()[dataSet].loading)
			return;
		dispatch(getPending());
		const data = genData(n);
		setTimeout(() => dispatch(getSuccess(data)), 1000)
	}

const defaultTablesConfig = {
	'1': {
		fixed: false,
		columns: {
			__ctrl__: {unselectable: true, shown: true, width: 48},
			id: {shown: true, width: 80},
			Name: {shown: true, width: 200},
			Text: {shown: true,	width: 200},
			Date: {shown: true,	width: 200},
			Number: {shown: true,	width: 200},
			Status: {shown: true,	width: 200}
		}
	},
	'2': {
		fixed: false,
		columns: {
			__ctrl__: {unselectable: true, shown: true, width: 48},
			id: {shown: true, width: 80},
			Name: {unselectable: true, shown: false, width: 200},
			Text: {shown: true,	width: 200},
			Date: {shown: true,	width: 200},
			Number: {shown: true,	width: 200},
			Status: {shown: true,	width: 200}
		}
	}
}

const LoaderButton= ({numberOfRows}) => {
	const dispatch = useDispatch();

	return (
		<Button onClick={() => dispatch(loadData(numberOfRows))} >Load {numberOfRows}</Button>
	)
}

function tableColumnsWithControl(expandable) {
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
}

export const SplitTable = ({expandable, numberOfRows}) => {

	const [splitView, setSplitView] = React.useState(false);
	const columns = React.useMemo(() => tableColumnsWithControl(expandable), [expandable]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
			<div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
				<LoaderButton numberOfRows={numberOfRows} />
				<ButtonGroup>
					<div style={{textAlign: 'center'}}>Table view</div>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<TableViewSelector dataSet={dataSet} />
						<TableColumnSelector dataSet={dataSet} columns={columns} />
						<ActionButton
							name='book-open'
							title='Show detail'
							isActive={splitView} 
							onClick={() => setSplitView(!splitView)} 
						/>
					</div>
				</ButtonGroup>
			</div>
			<ShowFilters dataSet={dataSet} fields={fields} />
			<SplitPanel splitView={splitView} >
				<Panel>
					<AppTable
						defaultTablesConfig={defaultTablesConfig}
						columns={columns}
						headerHeight={46}
						estimatedRowHeight={50}
						dataSet={dataSet}
						rowKey='id'
					/>
				</Panel>
				<Panel>
					<span>Something here...</span>
				</Panel>
			</SplitPanel>
		</div>
	)
}

export const NoDefaultTable = ({expandable, numberOfRows}) => {

	const columns = React.useMemo(() => tableColumnsWithControl(expandable), [expandable]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
			<div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
				<LoaderButton numberOfRows={numberOfRows} />
			</div>
			<ShowFilters dataSet={dataSet} fields={fields} />
			<div style={{flex: 1, width: '100%'}} >
					<AppTable
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
		},
		numberOfRows: {
			type: {name: 'number'},
			defaultValue: 5,
		}
	},
	decorators: [
		(Story) =>
			<Provider store={store}>
				<Story />
			</Provider>
	]
};
