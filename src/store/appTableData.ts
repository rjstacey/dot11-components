import {createSlice, createEntityAdapter, createSelector} from '@reduxjs/toolkit';
import type { EntityId, Comparer, IdSelector, PayloadAction, Dictionary, SliceCaseReducers, ValidateSliceCaseReducers, EntityState, Update } from '@reduxjs/toolkit';

import {selectSorts, sortData, SortDirectionType} from './sorts';
import {selectFilters, filterData} from './filters';

import { createSelectedSubslice, SelectedState } from './selected'
import { createExpandedSubslice, ExpandedState } from './expanded'
import { createFiltersSubslice, FiltersState, Filters } from './filters'
import { createSortsSubslice, SortsState, Sorts } from './sorts'
import { createUiSubslice, UiState } from './ui'

export * from './selected';
export * from './expanded';
export * from './filters';
export * from './sorts';
export * from './ui';

export { EntityId };

export type GetEntityField<EntityType = {}> = (entity: EntityType, dataKey: string) => any;

export type Option = {
	value: any;
	label: string;
};

export type ColumnFieldProperties = {
	label?: string;
	sortType?: number;
	sortDirection?: SortDirectionType;
	dontSort?: boolean;
	dontFilter?: boolean;
	options?: Array<Option>;
	//getField?: GetField;
};

export type Fields = {
	[dataKey: string]: ColumnFieldProperties;
};

const selectors =  {};

export const getAppTableDataSelectors = (dataSet: string) => selectors[dataSet];

export type AppTableDataState<EntityType> = {
	entities: Dictionary<EntityType>;
	ids: Array<EntityId>;
	loading: boolean;
	valid: boolean;
} & SelectedState & ExpandedState & FiltersState & SortsState & UiState;

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

export function createAppTableDataSlice<EntityType extends {}, Reducers extends SliceCaseReducers<AppTableDataState<EntityType>>>({
	name,
	fields,
	selectId,
	sortComparer,
	initialState: partialInitialState,
	reducers,
	extraReducers,
	selectField,
	selectEntities,	/** optional: Overload selectEntities */
	selectIds	/** optional: Overload selectIds */
}: {
	name: string;
	fields: Fields;
	selectId?: IdSelector<EntityType>;
	sortComparer?: Comparer<EntityType>;
	initialState: object;
	reducers?: ValidateSliceCaseReducers<AppTableDataState<EntityType>, Reducers>;
	extraReducers?: any;
	selectField?: GetEntityField<EntityType>;
	selectEntities?: (state: {}) => Dictionary<EntityType>;
	selectIds?: (state: {}) => EntityId[];
}) {

	const dataAdapter = createEntityAdapter<EntityType>(Object.assign({}, selectId? {selectId}: {}, sortComparer? {sortComparer}: {}));

	const selectedSubslice = createSelectedSubslice(name);
	const expandedSubslice = createExpandedSubslice(name);
	const filtersSubslice = createFiltersSubslice(name, fields);
	const sortsSubslice = createSortsSubslice(name, fields);
	const uiSubslice = createUiSubslice(name);

	const initialState = dataAdapter.getInitialState({
		...selectedSubslice.initialState,
		...expandedSubslice.initialState,
		...filtersSubslice.initialState,
		...sortsSubslice.initialState,
		...uiSubslice.initialState,
		...partialInitialState,
		loading: false,
		valid: false
	});

	const slice = createSlice({
		name,
		initialState,
		reducers: {
			getPending(state) {
				state.loading = true;
			},
  			getSuccess(state, action: PayloadAction<EntityType[]>) {
				state.loading = false;
				state.valid = true;
				dataAdapter.setAll(state as EntityState<EntityType>, action.payload);
			},
			getFailure(state) {
				state.loading = false;
			},

			setAll(state, action: PayloadAction<EntityType[]>) {dataAdapter.setAll(state as EntityState<EntityType>, action.payload)},

			setOne(state, action: PayloadAction<EntityType>) {dataAdapter.setOne(state as EntityState<EntityType>, action.payload)},
			setMany(state, action: PayloadAction<EntityType[]>) {dataAdapter.setMany(state as EntityState<EntityType>, action.payload)},

			addOne(state, action: PayloadAction<EntityType>) {dataAdapter.addOne(state as EntityState<EntityType>, action.payload)},
			addMany(state, action: PayloadAction<Array<EntityType>>) {dataAdapter.addMany(state as EntityState<EntityType>, action.payload)},

			updateOne(state, action: PayloadAction<Update<EntityType>>) {dataAdapter.updateOne(state as EntityState<EntityType>, action.payload)},
			updateMany(state, action: PayloadAction<Update<EntityType>[]>) {dataAdapter.updateMany(state as EntityState<EntityType>, action.payload)},

			upsertOne(state, action: PayloadAction<EntityType>) {dataAdapter.upsertOne(state as EntityState<EntityType>, action.payload)},
			upsertMany(state, action: PayloadAction<Array<EntityType>>) {dataAdapter.upsertMany(state as EntityState<EntityType>, action.payload)},

			removeOne(state, action: PayloadAction<EntityId>) {dataAdapter.removeOne(state as EntityState<EntityType>, action.payload)},
			removeMany(state, action: PayloadAction<EntityId[]>) {dataAdapter.removeMany(state as EntityState<EntityType>, action.payload)},
			removeAll(state) {dataAdapter.removeAll(state as EntityState<EntityType>)},

			...selectedSubslice.reducers,
			...expandedSubslice.reducers,
			...filtersSubslice.reducers,
			...sortsSubslice.reducers,
			...uiSubslice.reducers,
			...reducers,
		},
		extraReducers: builder => {
			selectedSubslice.extraReducers(builder);
			expandedSubslice.extraReducers(builder);
			if (extraReducers)
				extraReducers(builder, dataAdapter);
		}
	});

	if (!selectId)
		selectId = (entity: any): EntityId => entity.id;

	if (!selectField)
		selectField = (entity, dataKey) => entity[dataKey];

	const selectState = (state: {}): typeof initialState => state[name];

	if (!selectIds)
		selectIds = (state: {}): EntityId[] => selectState(state).ids;

	if (!selectEntities)
		selectEntities = (state: {}) => selectState(state).entities;

	const selectFilters = (state: {}) => selectState(state).filters;
	const selectSorts = (state: {}) => selectState(state).sorts;

	const getField = selectField;

	/** returns array of filtered ids */
	const selectFilteredIds = createSelector<any, EntityId[]>(
		selectFilters,
		selectEntities,
		selectIds,
		(filters, entities, ids) => filterData(filters, getField, entities, ids)
	);

	/** returns array of sorted ids */
 	const selectSortedIds = createSelector(
		selectSorts,
		selectEntities,
		selectIds,
		(sorts, entities, ids) => sortData(sorts, getField, entities, ids)
	);

	/** returns array of sorted and filtered ids */
	const selectSortedFilteredIds = createSelector(
		selectSorts,
		selectEntities,
		selectFilteredIds,
		(sorts, entities, ids) => sortData(sorts, getField, entities, ids)
	);

	/** Returns a list of unique values for a particular field */
	function uniqueFieldValues(entities: Dictionary<EntityType>, ids: EntityId[], dataKey: string): any[] {
		let values = ids.map(id => getField(entities[id]!, dataKey));
		return [...new Set(values.map(v => v !== null? v: ''))];
	}

	/** Generate an array of all the unique field values */
	const selectAllFieldValues = createSelector<any, any[]>(
		selectEntities,
		selectSortedIds,
		selectDataKey,
		uniqueFieldValues
	);

	/** Generate an array of unique values for the currently filtered entries */
	const selectAvailableFieldValues = createSelector<any, any[]>(
		selectEntities,
		selectSortedFilteredIds,
		selectDataKey,
		uniqueFieldValues
	);

	const appTableDataMethods = {
		selectState,
		selectIds,
		selectEntities,
		selectFilters,
		selectSorts,
		selectFilteredIds,
		selectSortedIds,
		selectSortedFilteredIds,
		selectAllFieldValues,
		selectAvailableFieldValues,
		selectSelectedIds: (state: {}) => selectState(state).selected,
		selectExpandedIds: (state: {}) => selectState(state).expanded,
		selectUiProperties: (state: {}) => selectState(state).ui,

		...slice.actions,
	}

	selectors[name] = {
		getField: selectField,
		getId: selectId,
		selectIds,
		selectEntities
	};

	return {...slice, appTableDataMethods};
}

export type AppTableDataMethods = ReturnType<typeof createAppTableDataSlice>['appTableDataMethods'];

export const selectEntities = (state, dataSet: string) => selectors[dataSet].selectEntities(state);
export const selectIds = (state, dataSet: string): Array<EntityId> => selectors[dataSet].selectIds(state);
export const selectGetField = (state, dataSet: string): GetEntityField => selectors[dataSet].getField;
export const selectGetId = (state, dataSet: string) => selectors[dataSet].getId;
const selectDataKey = (state, dataSet: string, dataKey: string) => dataKey;

/*
 * selectFilteredIds(state, dataSet)
 * returns array of filtered ids
 */
export const selectFilteredIds: (state: {}, dataSet: string) => EntityId[] = createSelector<any, EntityId[]>(
	[selectFilters,
	selectGetField,
	selectEntities,
	selectIds],
	filterData
);

/*
 * selectSortedIds(state, dataSet)
 * returns array of sorted ids
 */
export const selectSortedIds: (state: {}, dataSet: string) => EntityId[] = createSelector<any, EntityId[]>(
	[selectSorts,
	selectGetField,
	selectEntities,
	selectIds],
	sortData
);

/*
 * selectSortedFilteredIds(state, dataSet)
 * returns array of sorted and filtered ids
 */
export const selectSortedFilteredIds: (state: {}, dataSet: string) => EntityId[] = createSelector<any,EntityId[]>(
	[selectSorts,
	selectGetField,
	selectEntities,
	selectFilteredIds],
	sortData
);

/*
 * Returns a list of unique values for a particular field
 */
function uniqueFieldValues(getField: GetEntityField, entities: {}, ids: EntityId[], dataKey: string): any[] {
	let values = ids.map(id => getField(entities[id], dataKey));
	return [...new Set(values.map(v => v !== null? v: ''))];
}

/*
 * selectAllFieldOptions(state, dataSet, dataKey) selector
 * Generate an array of all the unique field values
 */
export const selectAllFieldValues: (state: {}, dataSet: string, dataKey: string) => any[] = createSelector<any, any[]>(
	[selectGetField,
	selectEntities,
	selectSortedIds,
	selectDataKey],
	uniqueFieldValues
);

/*
 * selectAvailableFieldOptions(state, dataSet, dataKey)
 * Generate an array of unique values for the currently filtered entries
 */
export const selectAvailableFieldValues: (state: {}, dataSet: string, dataKey: string) => any[] = createSelector<any, any[]>(
	[selectGetField,
	selectEntities,
	selectSortedFilteredIds,
	selectDataKey],
	uniqueFieldValues
);
