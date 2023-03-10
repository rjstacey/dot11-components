
import { parseNumber } from '../lib';
import type { EntityId, PayloadAction } from '@reduxjs/toolkit';
import type { Fields } from './appTableData';

export type SortDirectionType = "NONE" | "ASC" | "DESC";

export type Sort = {
	type: number;
	direction: SortDirectionType;
	//getField?: GetField;
};

export type SortSettings = { [dataKey: string]: Sort };

export type Sorts = {
	settings: SortSettings;
	by: Array<string>;
};

export const SortType = {
	STRING: 0,
	NUMERIC: 1,
	CLAUSE: 2,
	DATE: 3
}

export const SortDirection = {
	NONE: 'NONE',
	ASC: 'ASC',
	DESC: 'DESC'
}

export const cmpNumeric = (a, b) => {
	const A = parseNumber(a);
	const B = parseNumber(b);
	return A - B;
}

export const cmpClause = (a: string, b: string) => {
	const A = a.split('.')
	const B = b.split('.')
	for (let i = 0; i < Math.min(A.length, B.length); i++) {
		if (A[i] !== B[i]) {
			// compare as a number if it looks like a number
			// otherwise, compare as string
			const nA = Number(A[i]);
			const nB = Number(B[i]);
			if (!isNaN(nA) && !isNaN(nB)) {
				return nA - nB;
			}
			else {
				return A[i] < B[i]? -1: 1;
			}
		}
	}
	// Equal so far, so straight string compare
	return A < B? -1: (A > B? 1: 0);
}

export const cmpString = (a: string, b: string) => {
	const A = ('' + a).toLowerCase();
	const B = ('' + b).toLowerCase();
	return A < B? -1: (A > B? 1: 0);
}

export const cmpDate = (a: any, b: any) => a - b

export const sortFunc = {
	[SortType.NUMERIC]: cmpNumeric,
	[SortType.CLAUSE]: cmpClause,
	[SortType.STRING]: cmpString,
	[SortType.DATE]: cmpDate
}

export function sortData<EntityType = object>(sorts: Sorts, getField, entities: EntityType, ids: Array<EntityId>): Array<EntityId> {
	let sortedIds = ids.slice();
	for (const dataKey of sorts.by) {
		const {direction, type} = sorts.settings[dataKey];
		if (direction !== "ASC" && direction !== "DESC")
			continue;
		const cmpFunc = sortFunc[type];
		sortedIds = sortedIds.sort(
			(id_a, id_b) => cmpFunc(getField(entities[id_a], dataKey), getField(entities[id_b], dataKey))
		);
		if (direction === "DESC")
			sortedIds.reverse();
	}
	return sortedIds;
}

export function sortOptions(sort: Sort, options) {
	const {direction, type} = sort;
	let sortedOptions = options;

	if (direction === "ASC" || direction === "DESC") {
		const cmpFunc = sortFunc[type];
		sortedOptions = sortedOptions.sort((itemA, itemB) => cmpFunc(itemA.value, itemB.value));
		if (direction === "DESC")
			sortedOptions.reverse();
	}

	return sortedOptions;
}

function setSort(sorts: Sorts, dataKey: string, direction: SortDirectionType): Sorts {
	let {by, settings} = sorts;
	if (by.indexOf(dataKey) >= 0) {
		if (direction === "NONE")
			by = by.filter(d => d !== dataKey) // remove from sort by list
	}
	else {
		by = by.slice();
		by.unshift(dataKey);
	}
	if (direction !== settings[dataKey].direction) {
		settings = {
			...settings,
			[dataKey]: {...settings[dataKey], direction}
		};
	}
	return {
		...sorts,
		by,
		settings
	}
}


function sortsInit(fields: Fields): Sorts {
	const settings: SortSettings = {};
	for (const [dataKey, field] of Object.entries(fields)) {
		if (field.dontSort)
			continue;
		const type = field.sortType || SortType.STRING;
		if (!Object.values(SortType).includes(type))
			console.error(`Invalid sort type ${type} for dataKey=${dataKey}`);
		const direction = field.sortDirection || "NONE";
		if (!Object.values(SortDirection).includes(direction))
			console.error(`Invalid sort direction ${direction} for dataKey=${dataKey}`);
		//const {getField} = field;
		//if (getField && typeof getField !== 'function')
		//	console.error(`Invalid getField; needs to be a function getField(rowData, dataKey)`);
		settings[dataKey] = {
			type,
			direction,
		//	getField
		};
	}
	return {by: [], settings};
}

const name = 'sorts';

export type SortsState = { [name]: Sorts };

export const createSortsSubslice = (dataSet: string, fields: Fields) => {
	const initialState = {[name]: sortsInit(fields)};
	type SortsState = typeof initialState;
	return {
		name,
		initialState,
		reducers: {
			setSortDirection(state: SortsState, action: PayloadAction<{dataKey: string, direction: SortDirectionType}>) {
				const {dataKey, direction} = action.payload;
				state[name] = setSort(state[name], dataKey, direction);
			},
		}
	}
}

/* Actions */
export const sortSet = (dataSet: string, dataKey: string, direction: SortDirectionType) => ({type: dataSet + '/setSortDirection', payload: {dataKey, direction}});

/* Selectors */
export const selectSorts = (state, dataSet: string): Sorts => state[dataSet][name];
export const selectSort = (state, dataSet: string, dataKey: string): Sort | undefined => state[dataSet][name].settings[dataKey];
