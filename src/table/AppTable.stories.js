import { LoremIpsum } from "lorem-ipsum";
import React from 'react';
import { configureStore, combineReducers, createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { Provider, connect } from 'react-redux'

import {displayDate} from '../lib/utils'
import sortsSlice, {sortInit, SortDirection, SortType} from '../store/sort'
import filtersSlice, {filtersInit} from '../store/filters'
import selectedSlice from '../store/selected'
import expandedSlice from '../store/expanded'
import uiSlice from '../store/ui'

import AppTable, {ControlHeader, ControlCell, ColumnDropdown, ColumnSelector, ShowFilters, IdSelector, IdFilter} from '.'

const fields = {
	id: {label: 'ID'},
	Name: {label: 'Name'},
	Date: {label: 'Date', dataRenderer: displayDate},
	Text: {label: 'Text'},
	Number: {label: 'Number'},
};

/*
 * Generate a filter for each field (table column)
 */
const defaultFiltersEntries = Object.keys(fields).reduce((entries, dataKey) => {
	let options;
	return {...entries, [dataKey]: {options}}
}, {});

/*
 * Generate object that describes the initial sort state
 */
const defaultSortEntries = Object.keys(fields).reduce((entries, dataKey) => {
	let type
	switch (dataKey) {
		case 'id':
		case 'Number':
			type = SortType.NUMERIC
			break
		case 'Date':
			type = SortType.DATE
			break
		default:
			type = SortType.STRING
	}
	const direction = SortDirection.NONE;
	return {...entries, [dataKey]: {type, direction}}
}, {});

const dataAdapter = createEntityAdapter({});

const dataSet = 'data';

const slice = createSlice({
	name: dataSet,
	initialState: dataAdapter.getInitialState({
		valid: false,
		loading: false,
		[sortsSlice.name]: sortsSlice.reducer(undefined, sortInit(defaultSortEntries)),
		[filtersSlice.name]: filtersSlice.reducer(undefined, filtersInit(defaultFiltersEntries)),
		[selectedSlice.name]: selectedSlice.reducer(undefined, {}),
		[expandedSlice.name]: expandedSlice.reducer(undefined, {}),
		[uiSlice.name]: uiSlice.reducer(undefined, {})	
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
	},
	extraReducers: builder => {
		builder
		.addMatcher(
			(action) => action.type.startsWith(dataSet + '/'),
			(state, action) => {
				const sliceAction = {...action, type: action.type.replace(dataSet + '/', '')}
				state[sortsSlice.name] = sortsSlice.reducer(state[sortsSlice.name], sliceAction);
				state[filtersSlice.name] = filtersSlice.reducer(state[filtersSlice.name], sliceAction);
				state[selectedSlice.name] = selectedSlice.reducer(state[selectedSlice.name], sliceAction);
				state[expandedSlice.name] = expandedSlice.reducer(state[expandedSlice.name], sliceAction);
				state[uiSlice.name] = uiSlice.reducer(state[uiSlice.name], sliceAction);
			}
		)
	}
});

const store = configureStore({
  reducer: combineReducers({[slice.name]: slice.reducer}),
  middleware: [thunk, createLogger({collapsed: true})],
  devTools: true
});

const columns = [
	{key: '__ctrl__',
		width: 30, flexGrow: 0, flexShrink: 0,
		headerRenderer: p =>
			<ControlHeader
				dataSet={dataSet}
				customSelectorElement=<IdSelector style={{width: '200px'}} dataSet={dataSet} focusOnMount />
				{...p}
			/>,
		cellRenderer: p => <ControlCell dataSet={dataSet} {...p} />},
	{key: 'id', 
		...fields.id,
		width: 80, flexGrow: 1, flexShrink: 1, dropdownWidth: 200,
		headerRenderer: p =>
			<ColumnDropdown
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
		width: 200, flexGrow: 1, flexShrink: 1,
		cellRenderer: ({rowData, dataKey}) => displayDate(rowData[dataKey])},
	{key: 'Text',
		...fields.Text,
		width: 200, flexGrow: 1, flexShrink: 1},
	{key: 'Number',
		...fields.Number,
		width: 200, flexGrow: 1, flexShrink: 1},
];

export default {
  title: 'Table',
  component: AppTable,
  argTypes: {
  	fixed: {
  		type: {name: 'boolean'},
  	}
  }
};

const randomDate = (start, end) =>
	new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

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
			Text: lorem.generateSentences(3)
		}));

const {getPending, getSuccess} = slice.actions;
const loadData = () =>
	async (dispatch, getState) => {
		if (getState()[dataSet].loading)
			return;
		dispatch(getPending());
		const data = genData();
		setTimeout(() => dispatch(getSuccess(data)), 1000)
	}

const Butt = ({loadData}) =>
	<button onClick={loadData}>Loader...</button>
const ConnectedButton = connect(null, {loadData})(Butt)

export const Table1 = ({fixed}) =>
  <Provider store={store}>
  	<div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
  		<ShowFilters dataSet={dataSet} fields={fields} />
  		<div style={{width: '100%', flex: 1}}>
		    <AppTable
		    	fixed={fixed}
					columns={columns}
					headerHeight={50}
					estimatedRowHeight={50}
					dataSet={dataSet}
					rowKey='id'
			/>
		</div>
	</div>
  	<ConnectedButton />
  </Provider>