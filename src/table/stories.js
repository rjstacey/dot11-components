import { LoremIpsum } from "lorem-ipsum";
import React from 'react';
import { configureStore, combineReducers, createSelector } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider, useDispatch } from 'react-redux';

import {displayDate} from '../lib';
import {ActionIcon} from '../icons';
import {Button} from '../form';
import {createAppTableDataSlice, SortType} from '../store/appTableData';

import {
	AppTable, 
	SelectHeader, 
	SelectCell, 
	SelectExpandHeader,
	SelectExpandCell,
	TableColumnHeader,
	ShowFilters,
	GlobalFilter,
	IdSelector,
	IdFilter,
	SplitPanelButton,
	SplitPanel,
	Panel,
	SplitTableButtonGroup,
} from '.';


/*
 * Slice 2 maps an id to a name
 */
const fields2 = {
	id: {label: 'id'},
	Name: {label: 'Name'},
};

const slice2 = createAppTableDataSlice({name: 'names', fields: fields2, initialState: {}});
//console.log('done slice2')

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
	id: {label: 'ID', isId: true, sortType: SortType.NUMERIC},
	Name: {label: 'Name'},
	Date: {
		label: 'Date',
		dataRenderer: displayDate,
		sortType: SortType.DATE
	},
	Text: {
		label: 'Text',
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
	Derived: {
		label: 'Derived'
	},
};

const dataSet = 'data';

const selectField = (data, dataKey) => {
	if (dataKey === 'Derived')
		return data.Status + '-es';
	return data[dataKey];
}

/* A selector that returns the entities with name_id mapped to Name */
const selectEntities = createSelector(
	state => state['names'].entities,
	state => state[dataSet].entities,
	(nameEntities, entities) => {
		const transformedEntities = {};
		for (const [id, entity] of Object.entries(entities)) {
			const nameEntity = nameEntities[entity.name_id];
			const Name = nameEntity? nameEntity.Name: '';
			transformedEntities[id] = {...entity, Name};
		}
		return transformedEntities;
	}
);

const slice = createAppTableDataSlice({name: dataSet,	fields, initialState: {}, selectField, selectEntities});
//console.log('done slice')

const store = configureStore({
	reducer: combineReducers({
		[slice2.name]: slice2.reducer,
		[slice.name]: slice.reducer,
	}),
	middleware: [thunk, createLogger({collapsed: true})],
	devTools: true
});

//console.log('done store')

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
	{key: 'Derived',
		...fields.Derived,
		width: 200},
	{key: 'Actions',
		label: 'Actions',
		width: 200}
];

const randomDate = (start, end) =>
	new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const randomStatus = () => Math.round(Math.random() * (statusOptions.length - 1));

const lorem = new LoremIpsum({
	sentencesPerParagraph: {max: 8, min: 4},
	wordsPerSentence: {max: 16, min: 4}
});

const MaxNames = 4;

const genData = (n) =>
	new Array(n)
		.fill(true)
		.map((r, i) => ({
			id: i,
			name_id: Math.floor(Math.random() * MaxNames),
			Date: randomDate(new Date(2010, 0, 1), new Date()).toISOString(),
			Number: Math.round(Math.random() * 5),
			Text: lorem.generateSentences(3),
			Status: randomStatus()
		}));

const genData2 = () =>
	new Array(MaxNames)
		.fill(true)
		.map((r, i) => ({
			id: i,
			Name: Math.random().toString(36).slice(2),
		}));

const loadData = (n = 1000) =>
	(dispatch, getState) => {
		const data2 = genData2();
		dispatch(slice2.actions.getSuccess(data2));

		const {getPending, getSuccess} = slice.actions;
		dispatch(getPending());
		const data = genData(n);
		setTimeout(() => dispatch(getSuccess(data)), 1000);
	}

const removeRow = slice.actions.removeOne;

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
			Status: {shown: true,	width: 200},
			Derived: {shown: true, width: 200},
			Actions: {shown: true, width: 200}
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
			Status: {shown: true,	width: 200},
			Derived: {shown: true, width: 200},
			Actions: {shown: true, width: 200}
		}
	}
}

const LoaderButton= ({numberOfRows}) => {
	const dispatch = useDispatch();

	return (
		<Button onClick={() => dispatch(loadData(numberOfRows))} >Load {numberOfRows}</Button>
	)
}

function tableColumnsWithControl(expandable, dispatch) {
	const columns = tableColumns.slice();
	let headerRenderer, cellRenderer;
	if (expandable) {
		headerRenderer = p =>
			<SelectExpandHeader
				dataSet={dataSet}
				customSelectorElement=<IdSelector style={{width: '200px'}} dataSet={dataSet} dataKey={'id'} focusOnMount />
				{...p}
			/>;
		cellRenderer = p => <SelectExpandCell dataSet={dataSet} {...p} />;
	}
	else {
		headerRenderer = p =>
			<SelectHeader
				dataSet={dataSet}
				customSelectorElement=<IdSelector style={{width: '200px'}} dataSet={dataSet} dataKey={'id'} focusOnMount />
				{...p}
			/>;
		cellRenderer = p => <SelectCell dataSet={dataSet} {...p} />;
	}
	columns[0] = {...columns[0], headerRenderer, cellRenderer};
	cellRenderer = ({rowData}) => <ActionIcon type='delete' onClick={(e) => {e.stopPropagation(); dispatch(removeRow(rowData.id))}} />
	columns[columns.length-1] = {...columns[columns.length-1], cellRenderer};
	return columns;
}

export const _SplitPanel = ({expandable, numberOfRows}) => {

	return (
		<div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
			<div>
				<SplitPanelButton dataSet={dataSet} />
			</div>
			<SplitPanel dataSet={dataSet} >
				<Panel>
					<span>Something here...</span>
				</Panel>
				<Panel>
					<span>And something here...</span>
				</Panel>
			</SplitPanel>
		</div>
	)
}

export const SplitTable = ({expandable, numberOfRows}) => {

	const dispatch = useDispatch();

	const columns = React.useMemo(() => tableColumnsWithControl(expandable, dispatch), [expandable, dispatch]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
			<div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
				<LoaderButton numberOfRows={numberOfRows} />
				<SplitTableButtonGroup dataSet={dataSet} columns={columns} />
			</div>
			<div style={{display: 'flex', alignItems: 'center'}}>
				<ShowFilters dataSet={dataSet} fields={fields} />
				<GlobalFilter dataSet={dataSet} />
			</div>
			<SplitPanel dataSet={dataSet} >
				<Panel>
					<AppTable
						defaultTablesConfig={defaultTablesConfig}
						columns={columns}
						headerHeight={46}
						estimatedRowHeight={56}
						dataSet={dataSet}
					/>
				</Panel>
				<Panel>
					<span>Something here...</span>
				</Panel>
			</SplitPanel>
		</div>
	)
}

export const NoDefaultTable = ({fixed, expandable, numberOfRows}) => {

	const dispatch = useDispatch();
	const columns = React.useMemo(() => tableColumnsWithControl(expandable, dispatch), [expandable, dispatch]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
			<div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
				<LoaderButton numberOfRows={numberOfRows} />
			</div>
			<ShowFilters dataSet={dataSet} fields={fields} />
			<div style={{flex: 1, width: '100%'}} >
					<AppTable
						fixed={fixed}
						columns={columns}
						headerHeight={46}
						estimatedRowHeight={56}
						dataSet={dataSet}
					/>
			</div>
		</div>
	)
}

export const FixedCenteredTable = ({expandable, numberOfRows}) => {

	const dispatch = useDispatch();
	const columns = React.useMemo(() => tableColumnsWithControl(expandable, dispatch), [expandable, dispatch]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
			<div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
				<LoaderButton numberOfRows={numberOfRows} />
			</div>
			<ShowFilters dataSet={dataSet} fields={fields} />
			<div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
					<AppTable
						fitWidth
						fixed
						columns={columns}
						//defaultTablesConfig={{'fixed': {}}}
						headerHeight={46}
						estimatedRowHeight={56}
						dataSet={dataSet}
					/>
			</div>
		</div>
	)
}

const story = {
	title: 'Table',
	component: AppTable,
	args: {
		expandable: false,
		numberOfRows: 5,
	},
	decorators: [
		(Story) =>
			<Provider store={store}>
				<Story />
			</Provider>
	]
};

export default story;
