// filter.js - filter utility
//
// Began life here https://github.com/koalyptus/TableFilter
//
import type { PayloadAction, EntityId } from '@reduxjs/toolkit';
import { parseNumber } from '../lib';
import type { Fields, Field, Option, GetField } from './appTableData';

export const FilterType = {
	EXACT: 0,
	CONTAINS: 1,
	REGEX: 2,
	NUMERIC: 3,
	STRING: 4,
	CLAUSE: 5,
	PAGE: 6,
}

export const globalFilterKey = '__global__';

type Comp = {
	value: any;
	filterType: number;
};

/* Exact match
 * Exact if truthy true, but any truthy false will match
 */
const cmpExact = (d: any, val: any) => d? d === val: !val;

/* Clause match
 */
const cmpClause = (d: string, val: string) => {
	let len = val.length
	if (len && val[len-1] === '.')
		len = len - 1
	return d === val || (d && d.substring(0, len) === val.substring(0, len) && d[len] === '.')
}

/* Page match:
 * floating point number => match page and line
 * Integer value => match page
 */
const cmpPage = (d, val) => {
	const n = parseNumber(val);
	return (val.search(/\d+\./) !== -1)? d === n: Math.round(d) === n
}

const cmpRegex = (d, regex) => regex.test(d)

function cmpValue(comp: Comp, d: any) {
	const {value, filterType} = comp;
	let regex, parts;

	switch (filterType) {
		case FilterType.EXACT:
			return cmpExact(d, value);
		case FilterType.REGEX:
			parts = value.split('/');
			if (value[0] === '/' && parts.length > 2) {
				try {regex = new RegExp(parts[1], parts[2])} 
				catch (err) {console.error(err)}
			}
			return regex? cmpRegex(d, regex): false;
		case FilterType.CONTAINS:
			try {regex = new RegExp(value, 'i')} catch (err) {console.error(err)}
			return regex? cmpRegex(d, regex): false;
		case FilterType.CLAUSE:
			return cmpClause(d, value);
		case FilterType.PAGE:
			return cmpPage(d, value);
		default:
			console.error(`Unexpected filter type ${filterType}`);
			return false;
	}
}

/*
 * Applies the column filters in turn to the data.
 * Returns a list of ids that meet the filter requirements.
 */
export function filterData(filters: Filters, getField: GetField, entities: object, ids: Array<EntityId>): Array<EntityId> {
	let filteredIds = ids.slice();
	const dataKeys = Object.keys(filters).filter(dataKey => dataKey !== globalFilterKey);
	// Apply the column filters
	for (const dataKey of dataKeys) {
		const comps = filters[dataKey].comps;
		if (comps.length === 0)
			continue;
		filteredIds = filteredIds.filter(id =>
				comps.reduce((result, comp) => result || cmpValue(comp, getField(entities[id], dataKey)), false)
			);
	}
	// Apply the global filter
	if (filters[globalFilterKey]) {
		const comps = filters[globalFilterKey].comps;
		if (comps.length) {
			const comp = comps[0];
			filteredIds = filteredIds.filter(id => {
				const entity = entities[id];
				return dataKeys.reduce((result, dataKey) => result || cmpValue(comp, getField(entity, dataKey)), false)
			});
		}
	} 
	return filteredIds;
}

export type Filter = {
	options?: Array<Option>;
	comps: Array<Comp>;
}

export type Filters = {
	[key: string]: Filter;
};

const filterCreate = ({options}: Field): Filter => ({
	options,	// Array of {label, value} objects
	comps: [],	// Array of compare objects where a compare object {value, FilterType}
});

function filtersInit(fields: Fields) {
	const filters: Filters = {};
	for (const [dataKey, field] of Object.entries(fields)) {
		if (!field.dontFilter)
			filters[dataKey] = filterCreate(field)
	}
	filters[globalFilterKey] = filterCreate({});
	return filters;
}

const name = 'filters';

export type FiltersState = { [name]: Filters };

export const createFiltersSubslice = (dataSet: string, fields: Fields) => ({
	name,
	initialState: {[name]: filtersInit(fields)},
	reducers: {
		setFilter(state, action: PayloadAction<{dataKey: string; comps: Array<Comp>}>) {
			const filters = state[name];
			const {dataKey, comps} = action.payload;
			const filter = filterCreate(filters[dataKey] || {});
			filter.comps = comps;
			filters[dataKey] = filter;
		},
		addFilter(state, action: PayloadAction<{dataKey: string} & Comp>) {
			const filters = state[name];
			const {dataKey, value, filterType} = action.payload;
			filters[dataKey].comps.push({value, filterType});
		},
		removeFilter(state, action: PayloadAction<{dataKey: string} & Comp>) {
			const filters = state[name];
			const {dataKey, value, filterType} = action.payload;
			filters[dataKey].comps = filters[dataKey].comps.filter((comp: Comp) => comp.value !== value || comp.filterType !== filterType)
		},
		clearFilter(state, action: PayloadAction<{dataKey: string}>) {
			const filters = state[name];
			const {dataKey} = action.payload;
			filters[dataKey] = filterCreate(filters[dataKey]);
		},
		clearAllFilters(state) {
			state[name] = filtersInit(state[name]);
		},
	}
});

/* Actions */
export const setFilter = (dataSet: string, dataKey: string, comps: Array<Comp>) => ({type: dataSet + '/setFilter', payload: {dataKey, comps}});
export const addFilter = (dataSet: string, dataKey: string, value: any, filterType: number) => ({type: dataSet + '/addFilter', payload: {dataKey, value, filterType}});
export const removeFilter = (dataSet: string, dataKey: string, value: any, filterType: number) => ({type: dataSet + '/removeFilter', payload: {dataKey, value, filterType}});
export const clearFilter = (dataSet: string, dataKey: string) => ({type: dataSet + '/clearFilter', payload: {dataKey}});
export const clearAllFilters = (dataSet: string) => ({type: dataSet + '/clearAllFilters'});

/* Selectors */
 export const selectFilters = (state, dataSet: string): Filters => state[dataSet][name];
 export const selectFilter = (state, dataSet: string, dataKey: string): Filter | undefined => state[dataSet][name][dataKey];
 