import {createSlice, createEntityAdapter, createSelector} from '@reduxjs/toolkit';
import {selectSorts, sortData} from './sorts';
import {selectFilters, filterData} from './filters';

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

const selectors =  {};

export const getAppTableDataSelectors = (dataSet) => selectors[dataSet];

/*
 * Create a redux slice suitible for AppTable rendering.
 *
 * Data entries are managed through the redux toolkit dataAdapter.
 *
 * The selected subslice manages an array of ids representing selected data rows
 * The expanded subslice manages an array of ids representing expanded data rows (row height depends on content vs fixed row height)
 * The filters subslice manages the column filters
 * The sorts subslice manages the column sorts
 * The ui subslice manages the table settings (fixed, column widths, column shown/hidden, etc.)
 *
 * The transformEntities() function allows new entities to be derived from slice combinations or other state manipulation.
 * Field values may be derived from other fields by supplying a selectField() function. This allows derived values to be sorted.
 */
export function createAppTableDataSlice({
	name,
	fields,
	selectId,
	sortComparer,
	initialState,
	reducers,
	extraReducers,
	selectField,
	selectEntities,
	selectIds
}) {

	const dataAdapter = createEntityAdapter(Object.assign({}, selectId? {selectId}: {}, sortComparer? {sortComparer}: {}));

	selectors[name] = {}; //dataAdapter.getSelectors();
	selectors[name].getField = selectField? selectField: (entity, dataKey) => entity[dataKey];
	selectors[name].getId = selectId? selectId: (entity) => entity.id;
	selectors[name].selectIds = selectIds || (state => state[name].ids);
	selectors[name].selectEntities = selectEntities || (state => state[name].entities);

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
			setOne: dataAdapter.setOne,
			setMany: dataAdapter.setMany,
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

export const selectEntities = (state, dataSet) => selectors[dataSet].selectEntities(state);
export const selectIds = (state, dataSet) => selectors[dataSet].selectIds(state);
export const selectGetField = (state, dataSet) => selectors[dataSet].getField;
export const selectGetId = (state, dataSet) => selectors[dataSet].getId;
const selectDataKey = (state, dataSet, dataKey) => dataKey;

/*
 * selectFilteredIds(state, dataSet)
 * returns array of filtered ids
 */
export const selectFilteredIds = createSelector(
	selectFilters,
	selectGetField,
	selectEntities,
	selectIds,
	filterData
);

/*
 * selectSortedIds(state, dataSet)
 * returns array of sorted ids
 */
export const selectSortedIds = createSelector(
	selectSorts,
	selectGetField,
	selectEntities,
	selectIds,
	sortData
);

/*
 * selectSortedFilteredIds(state, dataSet)
 * returns array of sorted and filtered ids
 */
export const selectSortedFilteredIds = createSelector(
	selectSorts,
	selectGetField,
	selectEntities,
	selectFilteredIds,
	sortData
);

/*
 * Returns a list of unique values for a particular field
 */
function uniqueFieldValues(getField, entities, ids, dataKey) {
	let values = ids.map(id => getField(entities[id], dataKey));
	return [...new Set(values.map(v => v !== null? v: ''))];
}

/*
 * selectAllFieldOptions(state, dataSet, dataKey) selector
 * Generate an array of all unique field values
 */
export const selectAllFieldValues = createSelector(
	selectGetField,
	selectEntities,
	selectSortedIds,
	selectDataKey,
	uniqueFieldValues
);

/*
 * selectAvailableFieldOptions(state, dataSet, dataKey)
 * Generate an array of unique values for the currently filtered entries
 */
export const selectAvailableFieldValues = createSelector(
	selectGetField,
	selectEntities,
	selectSortedFilteredIds,
	selectDataKey,
	uniqueFieldValues
);
