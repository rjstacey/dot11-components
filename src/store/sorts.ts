import { parseNumber } from "../lib";
import type { EntityId, Dictionary, PayloadAction } from "@reduxjs/toolkit";
import {
	FieldType,
	FieldTypeValue,
	Fields,
	GetEntityField,
	Option,
} from "./appTableData";

export type Sort = {
	type: FieldTypeValue;
	direction: SortDirectionValue;
};

export type SortSettings = Record<string, Sort>;

export type Sorts = {
	settings: SortSettings;
	by: string[];
};

export const SortDirection = {
	NONE: "NONE",
	ASC: "ASC",
	DESC: "DESC",
} as const;
export type SortDirectionKey = keyof typeof SortDirection;
export type SortDirectionValue = typeof SortDirection[SortDirectionKey];

export const cmpNumeric = (a: string | number, b: string | number) => {
	const A = parseNumber(a);
	const B = parseNumber(b);
	return A - B;
};

export const cmpClause = (a: string, b: string) => {
	const A = a.split(".");
	const B = b.split(".");
	for (let i = 0; i < Math.min(A.length, B.length); i++) {
		if (A[i] !== B[i]) {
			// compare as a number if it looks like a number
			// otherwise, compare as string
			const nA = Number(A[i]);
			const nB = Number(B[i]);
			if (!isNaN(nA) && !isNaN(nB)) {
				return nA - nB;
			} else {
				return A[i] < B[i] ? -1 : 1;
			}
		}
	}
	// Equal so far, so straight string compare
	return A < B ? -1 : A > B ? 1 : 0;
};

export const cmpString = (a: string, b: string) => {
	const A = ("" + a).toLowerCase();
	const B = ("" + b).toLowerCase();
	return A < B ? -1 : A > B ? 1 : 0;
};

export const cmpDate = (a: string, b: string) =>
	new Date(a).valueOf() - new Date(b).valueOf();

export const sortFunc = {
	NUMERIC: cmpNumeric,
	CLAUSE: cmpClause,
	STRING: cmpString,
	DATE: cmpDate,
} as const;

export function sortData<EntityType = {}>(
	sorts: Sorts,
	getField: GetEntityField<EntityType>,
	entities: Dictionary<EntityType>,
	ids: EntityId[]
): EntityId[] {
	let sortedIds = ids.slice();
	for (const dataKey of sorts.by) {
		const { direction, type } = sorts.settings[dataKey];
		if (direction !== SortDirection.ASC && direction !== SortDirection.DESC)
			continue;
		const cmpFunc = sortFunc[type];
		sortedIds = sortedIds.sort((id_a, id_b) =>
			cmpFunc(
				getField(entities[id_a]!, dataKey),
				getField(entities[id_b]!, dataKey)
			)
		);
		if (direction === "DESC") sortedIds.reverse();
	}
	return sortedIds;
}

export function sortOptions<T extends Option>(sort: Sort, options: T[]): T[] {
	const { direction, type } = sort;
	let sortedOptions = options;

	if (direction === SortDirection.ASC || direction === SortDirection.DESC) {
		const cmpFunc = sortFunc[type];
		sortedOptions = sortedOptions.sort((itemA, itemB) =>
			cmpFunc(itemA.value, itemB.value)
		);
		if (direction === SortDirection.DESC) sortedOptions.reverse();
	}

	return sortedOptions;
}

function setSort(
	sorts: Sorts,
	dataKey: string,
	direction: SortDirectionValue
): Sorts {
	let { by, settings } = sorts;
	if (by.indexOf(dataKey) >= 0) {
		if (direction === SortDirection.NONE)
			by = by.filter((d) => d !== dataKey); // remove from sort by list
	} else {
		by = by.slice();
		by.unshift(dataKey);
	}
	if (direction !== settings[dataKey].direction) {
		settings = {
			...settings,
			[dataKey]: { ...settings[dataKey], direction },
		};
	}
	return {
		...sorts,
		by,
		settings,
	};
}

function sortsInit(fields: Fields): Sorts {
	const settings: SortSettings = {};
	for (const [dataKey, field] of Object.entries(fields)) {
		if (field.dontSort) continue;
		const type = field.type || FieldType.STRING;
		const direction = field.sortDirection || SortDirection.NONE;
		settings[dataKey] = {
			type,
			direction,
		};
	}
	return { by: [], settings };
}

const name = "sorts";

export type SortsState = { [name]: Sorts };

export const createSortsSubslice = (dataSet: string, fields: Fields) => {
	const initialState: SortsState = { [name]: sortsInit(fields) };

	const reducers = {
		setSortDirection(
			state: SortsState,
			action: PayloadAction<{
				dataKey: string;
				direction: SortDirectionValue;
			}>
		) {
			const { dataKey, direction } = action.payload;
			state[name] = setSort(state[name], dataKey, direction);
		},
	};

	return {
		name,
		initialState,
		reducers,
	};
};

export function getSortsSelectors<S>(selectState: (state: S) => SortsState) {
	return {
		/** All sorts. Has shape {by, settings} */
		selectSorts: (state: S) => selectState(state)[name],
		/** The sort for @param dataKey */
		selectSort: (state: S, dataKey: string) =>
			selectState(state)[name].settings[dataKey],
	};
}
