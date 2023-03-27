import React from 'react';
import { Provider } from 'react-redux';

import {ActionIcon} from '../icons';
import {Button} from '../form';

import store, {loadData, removeRow, dataFields, useAppDispatch, dataSelectors, dataActions} from './tableStoryStore';

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
	HeaderRendererProps,
	CellRendererProps,
	ColumnProperties
} from '../table';

const dataSet = 'data';

const tableColumns: Array<ColumnProperties> = [
	{key: '__ctrl__',
		width: 48, flexGrow: 0, flexShrink: 0},
	{key: 'id', 
		...dataFields.id,
		width: 80, flexGrow: 1, flexShrink: 1, dropdownWidth: 200,
		headerRenderer: p =>
			<TableColumnHeader
				//dataSet={dataSet}
				selectors={dataSelectors}
				actions={dataActions}
				customFilterElement=<IdFilter /*dataSet={dataSet}*/ selectors={dataSelectors} actions={dataActions} dataKey='id' />
				{...p}
			/>
	},
	{key: 'Name', 
		...dataFields.Name,
		width: 80, flexGrow: 1, flexShrink: 1, dropdownWidth: 200},
	{key: 'Date',
		...dataFields.Date,
		width: 200, flexGrow: 1, flexShrink: 1},
	{key: 'Text',
		...dataFields.Text,
		width: 200, flexGrow: 1, flexShrink: 1},
	{key: 'Number',
		...dataFields.Number,
		width: 200, flexGrow: 1, flexShrink: 1},
	{key: 'Status',
		...dataFields.Status,
		width: 200, flexGrow: 1, flexShrink: 1},
	{key: 'Derived',
		...dataFields.Derived,
		width: 200},
	{key: 'Actions',
		label: 'Actions',
		width: 200}
];

const defaultTablesConfig = {
	'1': {
		fixed: false,
		columns: {
			__ctrl__: {unselectable: true, shown: true, width: 48},
			id: {shown: true, width: 80},
			Name: {shown: true, width: 200},
			Text: {shown: true,	width: 200},
			Date: {shown: true,	width: 200},
			Number: {shown: true, width: 200},
			Status: {shown: true, width: 200},
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
			Number: {shown: true, width: 200},
			Status: {shown: true, width: 200},
			Derived: {shown: true, width: 200},
			Actions: {shown: true, width: 200}
		}
	}
}

const LoaderButton= ({numberOfRows}) => {
	const dispatch = useAppDispatch();

	return (
		<Button onClick={() => dispatch(loadData(numberOfRows))} >Load {numberOfRows}</Button>
	)
}

function tableColumnsWithControl(expandable, dispatch) {
	const columns = tableColumns.slice();
	let headerRenderer: (p: HeaderRendererProps) => JSX.Element,
		cellRenderer: (p: CellRendererProps) => JSX.Element;
	if (expandable) {
		headerRenderer = (p) =>
			<SelectExpandHeader
				selectors={dataSelectors}
				actions={dataActions}
				customSelectorElement=<IdSelector style={{width: '200px'}} selectors={dataSelectors} actions={dataActions} dataKey={'id'} focusOnMount />
				{...p}
			/>;
		cellRenderer = (p) => <SelectExpandCell selectors={dataSelectors} actions={dataActions} {...p} />;
	}
	else {
		headerRenderer = (p) =>
			<SelectHeader
				selectors={dataSelectors}
				actions={dataActions}
				customSelectorElement=<IdSelector style={{width: '200px'}} selectors={dataSelectors} actions={dataActions} dataKey={'id'} focusOnMount />
				{...p}
			/>;
		cellRenderer = (p) => <SelectCell selectors={dataSelectors} actions={dataActions} {...p} />;
	}
	columns[0] = {...columns[0], headerRenderer, cellRenderer};
	cellRenderer = ({rowData}: {rowData: any}) => <ActionIcon type='delete' onClick={(e) => {e.stopPropagation(); dispatch(removeRow(rowData.id))}} />
	columns[columns.length-1] = {...columns[columns.length-1], cellRenderer};
	return columns;
}

export const _SplitPanel = ({expandable, numberOfRows}) => {

	return (
		<div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
			<div>
				<SplitPanelButton selectors={dataSelectors} actions={dataActions} />
			</div>
			<SplitPanel selectors={dataSelectors} actions={dataActions} >
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

	const dispatch = useAppDispatch();

	const columns = React.useMemo(() => tableColumnsWithControl(expandable, dispatch), [expandable, dispatch]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
			<div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
				<LoaderButton numberOfRows={numberOfRows} />
				<SplitTableButtonGroup
					columns={columns}
					selectors={dataSelectors}
					actions={dataActions}
				/>
			</div>
			<div style={{display: 'flex', alignItems: 'center'}}>
				<ShowFilters
					selectors={dataSelectors}
					actions={dataActions}
					fields={dataFields}
				/>
				<GlobalFilter
					selectors={dataSelectors}
					actions={dataActions}
				/>
			</div>
			<SplitPanel
				selectors={dataSelectors}
				actions={dataActions}
			>
				<Panel>
					<AppTable
						defaultTablesConfig={defaultTablesConfig}
						columns={columns}
						headerHeight={46}
						estimatedRowHeight={56}
						selectors={dataSelectors}
						actions={dataActions}
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

	const dispatch = useAppDispatch();
	const columns = React.useMemo(() => tableColumnsWithControl(expandable, dispatch), [expandable, dispatch]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
			<div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
				<LoaderButton numberOfRows={numberOfRows} />
			</div>
			<ShowFilters 
				selectors={dataSelectors}
				actions={dataActions}
				fields={dataFields}
			/>
			<div style={{flex: 1, width: '100%'}} >
					<AppTable
						fixed={fixed}
						columns={columns}
						headerHeight={46}
						estimatedRowHeight={56}
						selectors={dataSelectors}
						actions={dataActions}
					/>
			</div>
		</div>
	)
}

export const FixedCenteredTable = ({expandable, numberOfRows}) => {

	const dispatch = useAppDispatch();
	const columns = React.useMemo(() => tableColumnsWithControl(expandable, dispatch), [expandable, dispatch]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
			<div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
				<LoaderButton numberOfRows={numberOfRows} />
			</div>
			<ShowFilters
				selectors={dataSelectors}
				actions={dataActions}
				fields={dataFields}
			/>
			<div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
					<AppTable
						fitWidth
						fixed
						columns={columns}
						//defaultTablesConfig={{'fixed': {}}}
						headerHeight={46}
						estimatedRowHeight={56}
						selectors={dataSelectors}
						actions={dataActions}
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
