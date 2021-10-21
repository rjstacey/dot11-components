import {createSlice, createEntityAdapter} from '@reduxjs/toolkit'

import {createSelectedSubslice} from './selected'
import {createExpandedSubslice} from './expanded'
import {createFiltersSubslice} from './filters'
import {createSortsSubslice} from './sorts'
import {createUiSubslice} from './ui'

export * from './selected';
export * from './expanded';
export * from './filters';
export * from './sorts';
export * from './ui';

export const createAppTableDataSlice = ({
	name,
	fields,
	selectId,
	sortComparer,
	initialState,
	reducers,
	extraReducers
}) => {

	const dataAdapter = createEntityAdapter(Object.assign({}, selectId? {selectId}:{}, sortComparer?{sortComparer}: {}));
	const selectedSubslice = createSelectedSubslice(name);
	const expandedSubslice = createExpandedSubslice(name);
	const filtersSubslice = createFiltersSubslice(name, fields);
	const sortsSubslice = createSortsSubslice(name, fields);
	const uiSubslice = createUiSubslice(name);

	const slice = createSlice({
		name,
		initialState: {
			...dataAdapter.getInitialState(),
			...selectedSubslice.initialState,
			...expandedSubslice.initialState,
			...filtersSubslice.initialState,
			...sortsSubslice.initialState,
			...uiSubslice.initialState,
			...initialState,
			loading: false,
			valid: false
		},
		reducers: {
			getPending(state, action) {
				state.loading = true;
			},
  			getSuccess(state, action) {
				state.loading = false;
				state.valid = true;
				dataAdapter.setAll(state, action);
			},
			getFailure(state, action) {
				state.loading = false;
			},
			setAll: dataAdapter.setAll,
			addOne: dataAdapter.addOne,
			addMany: dataAdapter.addMany,
			updateOne: dataAdapter.updateOne,
			updateMany: dataAdapter.updateMany,
			upsertOne: dataAdapter.upsertOne,
			upsertMany: dataAdapter.upsertMany,
			removeOne: dataAdapter.removeOne,
			removeMany: dataAdapter.removeMany,
			removeAll: dataAdapter.removeAll,
			...selectedSubslice.reducers,
			...expandedSubslice.reducers,
			...filtersSubslice.reducers,
			...sortsSubslice.reducers,
			...uiSubslice.reducers,
			...reducers,
		},
		extraReducers: builder => {
			if (selectedSubslice.extraReducers)
				selectedSubslice.extraReducers(builder);
			if (expandedSubslice.extraReducers)
				expandedSubslice.extraReducers(builder);
			if (filtersSubslice.extraReducers)
				filtersSubslice.extraReducers(builder);
			if (sortsSubslice.extraReducers)
				sortsSubslice.extraReducers(builder);
			if (uiSubslice.extraReducers)
				uiSubslice.extraReducers(builder);
			if (extraReducers)
				extraReducers(builder, dataAdapter);
		}
	});

	return slice;
}

export * from './dataSelectors';
