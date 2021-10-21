
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

const parseNumber = (value) => {
	// Return the value as-is if it's already a number
	if (typeof value === 'number')
		return value

	// Build regex to strip out everything except digits, decimal point and minus sign
	let regex = new RegExp('[^0-9-.]', ['g']);
	let unformatted = parseFloat((''+value).replace(regex, ''));

	// This will fail silently
	return !isNaN(unformatted)? unformatted: 0;
};

export const cmpNumeric = (a, b) => {
	const A = parseNumber(a);
	const B = parseNumber(b);
	return A - B;
}

export const cmpClause = (a, b) => {
	const A = a.split('.')
	const B = b.split('.')
	for (let i = 0; i < Math.min(A.length, B.length); i++) {
		if (A[i] !== B[i]) {
			// compare as a number if it looks like a number
			// otherwise, compare as string
			if (!isNaN(A[i]) && !isNaN(B[i])) {
				return parseNumber(A[i]) - parseNumber(B[i], 10);
			}
			else {
				return A[i] < B[i]? -1: 1;
			}
		}
	}
	// Equal so far, so straight string compare
	return A < B? -1: (A > B? 1: 0);
}

export const cmpString = (a, b) => {
	const A = ('' + a).toLowerCase();
	const B = ('' + b).toLowerCase();
	return A < B? -1: (A > B? 1: 0);
}

export const cmpDate = (a, b) => a - b

export const sortFunc = {
	[SortType.NUMERIC]: cmpNumeric,
	[SortType.CLAUSE]: cmpClause,
	[SortType.STRING]: cmpString,
	[SortType.DATE]: cmpDate
}

export function sortData(sorts, entities, ids) {
	let sortedIds = ids.slice();
	for (const dataKey of sorts.by) {
		const {direction, type} = sorts.settings[dataKey];
		if (direction !== SortDirection.ASC && direction !== SortDirection.DESC)
			return;
		let {getField} = sorts.settings[dataKey];
		if (!getField)
			getField = (dataRow, dataKey) => dataRow[dataKey];
		const cmpFunc = sortFunc[type];
		sortedIds = sortedIds.sort(
			(id_a, id_b) => cmpFunc(getField(entities[id_a], dataKey), getField(entities[id_b], dataKey))
		);
		if (direction === SortDirection.DESC)
			sortedIds.reverse();
	}
	return sortedIds;
}

export function sortOptions(sort, options) {
	const {direction, type} = sort;
	let sortedOptions = options;

	if (direction === SortDirection.ASC || direction === SortDirection.DESC) {
		const cmpFunc = sortFunc[type];
		sortedOptions = sortedOptions.sort((itemA, itemB) => cmpFunc(itemA.value, itemB.value));
		if (direction === SortDirection.DESC)
			sortedOptions.reverse();
	}

	return sortedOptions;
}

function setSort(sorts, dataKey, direction) {
	let {by, settings} = sorts;
	if (by.indexOf(dataKey) >= 0) {
		if (direction === SortDirection.NONE)
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

function sortsInit(fields) {
	const settings = {};
	for (const [dataKey, field] of Object.entries(fields)) {
		if (field.dontSort)
			continue;
		const type = field.sortType || SortType.STRING;
		if (!Object.values(SortType).includes(type))
			console.error(`Invalid sort type ${type} for dataKey=${dataKey}`);
		const direction = field.sortDirection || SortDirection.NONE;
		if (!Object.values(SortDirection).includes(direction))
			console.error(`Invalid sort direction ${direction} for dataKey=${dataKey}`);
		const {getField} = field;
		if (getField && typeof getField !== 'function')
			console.error(`Invalid getField; needs to be a function getField(rowData, dataKey)`);
		settings[dataKey] = {
			type,
			direction,
			getField
		};
	}
	return {by: [], settings};
}

const name = 'sorts';

export const createSortsSubslice = (dataSet, fields) => ({
	name,
	initialState: {[name]: sortsInit(fields)},
	reducers: {
		setSort(state, action) {
			const {dataKey, direction} = action.payload;
			state[name] = setSort(state[name], dataKey, direction);
		},
	}
})

/* Actions */
export const sortSet = (dataSet, dataKey, direction) => ({type: dataSet + '/setSort', payload: {dataKey, direction}});

/* Selectors */
export const getSorts = (state, dataSet) => state[dataSet][name];
export const getSort = (state, dataSet, dataKey) => state[dataSet][name].settings[dataKey];
