import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type {
	EntityId,
	Comparer,
	IdSelector,
	PayloadAction,
	Dictionary,
	Update,
	SliceCaseReducers,
	ValidateSliceCaseReducers,
	EntityState,
	ActionReducerMapBuilder,
	EntityAdapter,
} from '@reduxjs/toolkit';
import { createSelector } from 'reselect';	/* Use older version; the newer version does not handle typescript generics well */

import { sortData, SortDirectionType} from './sorts';
import { filterData } from './filters';

import { createSelectedSubslice, getSelectedSelectors, SelectedState } from './selected'
import { createExpandedSubslice, getExpandedSelectors, ExpandedState  } from './expanded'
import { createFiltersSubslice, getFiltersSelectors, FiltersState } from './filters'
import { createSortsSubslice, getSortsSelectors, SortsState } from './sorts'
import { createUiSubslice, getUiSelectors, UiState } from './ui'

export * from './selected';
export * from './expanded';
export * from './filters';
export * from './sorts';
export * from './ui';

export { EntityId, Dictionary };

export type GetEntityField<EntityType> = (entity: EntityType, dataKey: string) => any;

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
	options?: Option[];
	dataRenderer?: (value: any) => string | number;
};

export type Fields = {
	[dataKey: string]: ColumnFieldProperties;
};

type LoadingState = {
	loading: boolean;
	valid: boolean;
};

export type AppTableDataState<EntityType> =
	EntityState<EntityType> &
	LoadingState &
	SelectedState &
	ExpandedState &
	FiltersState &
	SortsState &
	UiState;

export function getAppTableDataSelectors<S, T>(
	selectState: (state: S) => AppTableDataState<T>,
	selectEntities?: (state: S) => Dictionary<T>,
	getField?: (entity: T, dataKey: string) => any
) {

	const selectIds = (state: S) => selectState(state).ids;
	const selectFilters = (state: S) => selectState(state).filters;
	const selectSorts = (state: S) => selectState(state).sorts;

	if (!selectEntities)
		selectEntities = (state: S) => selectState(state).entities as Dictionary<T>;

	if (!getField)
		getField = (entity: T, dataKey: string) => entity[dataKey];

	/** returns array of filtered ids */
	const selectFilteredIds: (state: S) => EntityId[] = createSelector(
		selectFilters,
		selectEntities,
		selectIds,
		(filters, entities, ids) => filterData(filters, getField!, entities, ids)
	);

	/** returns array of sorted ids */
	const selectSortedIds: (state: S) => EntityId[] = createSelector(
		[selectSorts,
		selectEntities,
		selectIds],
		(sorts, entities, ids) => sortData(sorts, getField!, entities, ids)
	);

	/** returns array of sorted and filtered ids */
	const selectSortedFilteredIds: (state: S) => EntityId[] = createSelector(
		[selectSorts,
		selectEntities,
		selectFilteredIds],
		(sorts, entities, ids) => sortData(sorts, getField!, entities, ids)
	);

	/** Returns a list of unique values for a particular field */
	function uniqueFieldValues(entities: Dictionary<T>, ids: EntityId[], dataKey: string): any[] {
		let values = ids.map(id => getField!(entities[id]!, dataKey));
		return [...new Set(values.map(v => v !== null? v: ''))];
	}
	
	const selectDataKey = (state: unknown, dataKey: string) => dataKey; 

	/** Generate an array of all the unique field values */
	const selectAllFieldValues: (state: S, dataKey: string) => EntityId[] = createSelector(
		[selectEntities,
		selectSortedIds,
		selectDataKey],
		uniqueFieldValues
	);

	/** Generate an array of unique values for the currently filtered entries */
	const selectAvailableFieldValues: (state: S, dataKey: string) => EntityId[] = createSelector(
		[selectEntities,
		selectSortedFilteredIds,
		selectDataKey],
		uniqueFieldValues
	);

	return {
		getField,
		selectState,
		selectIds,
		selectEntities,
		selectSortedIds,
		selectFilteredIds,
		selectSortedFilteredIds,
		selectAllFieldValues,
		selectAvailableFieldValues,
		...getSelectedSelectors(selectState),
		...getExpandedSelectors(selectState),
		...getFiltersSelectors(selectState),
		...getSortsSelectors(selectState),
		...getUiSelectors(selectState),
	}
}

export type AppTableDataSelectors<S = any, T = any> = ReturnType<typeof getAppTableDataSelectors<S, T>>;

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

export function createAppTableDataSlice<
	T = any,
	ExtraState = {},
	Reducers extends SliceCaseReducers<ExtraState & AppTableDataState<T>> = SliceCaseReducers<ExtraState & AppTableDataState<T>>,
>({
	name,
	fields,
	selectId,
	sortComparer,
	initialState,
	reducers,
	extraReducers,
}: {
	name: string;
	fields: Fields;
	selectId?: IdSelector<T>;
	sortComparer?: Comparer<T>;
	initialState: ExtraState;
	reducers: ValidateSliceCaseReducers<ExtraState & AppTableDataState<T>, Reducers>;
	extraReducers?: (builder: ActionReducerMapBuilder<ExtraState & AppTableDataState<T>>, dataAdapter: EntityAdapter<T>) => void;
}) {

	const dataAdapter = createEntityAdapter<T>(
		Object.assign({}, selectId? {selectId}: {}, sortComparer? {sortComparer}: {})
	);

	const selectedSubslice = createSelectedSubslice(name);
	const expandedSubslice = createExpandedSubslice(name);
	const filtersSubslice = createFiltersSubslice(name, fields);
	const sortsSubslice = createSortsSubslice(name, fields);
	const uiSubslice = createUiSubslice(name);

	const entityReducers: {
		/** Indicate that a data set load is pending (flag as `loading`) */
		getPending(state: AppTableDataState<T>): void,
		/** Load data set load and indicate successful (flag as `valid` and not `loading`) */
		getSuccess(state: AppTableDataState<T>, action: PayloadAction<T[]>): void,
		/** Data set load failed (flag as not `loading`) */
		getFailure(state: AppTableDataState<T>): void,
		setAll(state: EntityState<T>, action: PayloadAction<T[]>): void,
		setOne(state: EntityState<T>, action: PayloadAction<T>): void,
		setMany(state: EntityState<T>, action: PayloadAction<T[]>): void,
		addOne(state: EntityState<T>, action: PayloadAction<T>): void,
		addMany(state: EntityState<T>, action: PayloadAction<T[]>): void,
		updateOne(state: EntityState<T>, action: PayloadAction<Update<T>>): void,
		updateMany(state: EntityState<T>, action: PayloadAction<Update<T>[]>): void,
		upsertOne(state: EntityState<T>, action: PayloadAction<T>): void,
		upsertMany(state: EntityState<T>, action: PayloadAction<T[]>): void,
		removeOne(state: EntityState<T>, action: PayloadAction<EntityId>): void,
		removeMany(state: EntityState<T>, action: PayloadAction<EntityId[]>): void,
		removeAll(state: EntityState<T>): void
	} = {
		getPending(state) {
			state.loading = true;
		},
		getSuccess(state, action) {
			state.loading = false;
			state.valid = true;
			dataAdapter.setAll(state, action.payload);
		},
		getFailure(state) {
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
	}

	const slice = createSlice({
		name,
		initialState: dataAdapter.getInitialState({
			loading: false,
			valid: false,
			...selectedSubslice.initialState,
			...expandedSubslice.initialState,
			...filtersSubslice.initialState,
			...sortsSubslice.initialState,
			...uiSubslice.initialState,
			...initialState,
		}) as ExtraState & AppTableDataState<T>,
		reducers: {
			...reducers,
			...entityReducers,
			...selectedSubslice.reducers,
			...expandedSubslice.reducers,
			...filtersSubslice.reducers,
			...sortsSubslice.reducers,
			...uiSubslice.reducers,
		},
		extraReducers: (builder: ActionReducerMapBuilder<ExtraState & AppTableDataState<T>>) => {
			selectedSubslice.extraReducers(builder);
			expandedSubslice.extraReducers(builder);
			if (extraReducers)
				extraReducers(builder, dataAdapter);
		}
	});

	return slice;
}

export type AppTableDataActions = ReturnType<typeof createAppTableDataSlice<any>>['actions'];

