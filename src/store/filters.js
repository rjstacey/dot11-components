// filter.js - filter utility
//
// Began life here https://github.com/koalyptus/TableFilter
//

export const FilterType = {
	EXACT: 0,
	CONTAINS: 1,
	REGEX: 2,
	NUMERIC: 3,
	STRING: 4,
	CLAUSE: 5,
	PAGE: 6,
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

/*
 * Applies the column filters in turn to the data.
 * Returns a list of ids that meet the filter requirements.
 */
export function filterData(filters, getField, entities, ids) {
	let filteredIds = ids.slice();
	for (const [dataKey, filter] of Object.entries(filters)) {
		const values = filter.values;
		if (values.length) {
			filteredIds = filteredIds.filter(id =>
				values.reduce((result, value) => result || (value.valid && value.compFunc(getField(entities[id], dataKey))), false)
			);
		}
	}
	return filteredIds;
}

/* Exact match
 * Exact if truthy true, but any truthy false will match
 */
const cmpExact = (d, val) => d? d === val: !val;

/* Clause match
 */
const cmpClause = (d, val) => {
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

function filterNewValue(value, filterType) {
	let compFunc, regex

	switch (filterType) {
		case FilterType.EXACT:
			compFunc = d => cmpExact(d, value);
			break;
		case FilterType.REGEX:
			compFunc = d => cmpRegex(d, value);
			break;
		case FilterType.CONTAINS:
			regex = new RegExp(value, 'i');
			compFunc = d => cmpRegex(d, regex);
			break;
		case FilterType.CLAUSE:
			compFunc = d => cmpClause(d, value);
			break;
		case FilterType.PAGE:
			compFunc = d => cmpPage(d, value);
			break;
		default:
			throw TypeError(`Unexpected filter type ${filterType}`);
	}

	return {value, valid: compFunc !== undefined, filterType, compFunc}
}

const filterCreate = ({options, getField}) => ({
	options,	// Array of {label, value} objects
	getField,	// Function to derive field value
	values: [],	// Array of filter value objects where a filter value object is {value, valid, FilterType, compFunc}
})

function filtersInit(fields) {
	const filters = {};
	for (const [dataKey, field] of Object.entries(fields)) {
		if (!field.dontFilter)
			filters[dataKey] = filterCreate(field)
	}
	return filters;
}

const name = 'filters';

export const createFiltersSubslice = (dataSet, fields) => ({
	name,
	initialState: {[name]: filtersInit(fields)},
	reducers: {
		setFilter(state, action) {
			const filters = state[name];
			const {dataKey, values} = action.payload;
			const filter = filterCreate(filters[dataKey]);
			for (let value of values)
				filter.values.push(filterNewValue(value, FilterType.EXACT));
			filters[dataKey] = filter;
		},
		addFilter(state, action) {
			const filters = state[name];
			const {dataKey, value, filterType} = action.payload;
			filters[dataKey].values.push(filterNewValue(value, filterType));
		},
		removeFilter(state, action) {
			const filters = state[name];
			const {dataKey, value, filterType} = action.payload;
			filters[dataKey].values = filters[dataKey].values.filter(v => v.value !== value || v.filterType !== filterType)
		},
		clearFilter(state, action) {
			const filters = state[name];
			const {dataKey} = action.payload;
			filters[dataKey] = filterCreate(filters[dataKey]);
		},
		clearAllFilters(state, action) {
			state[name] = filtersInit(state[name]);
		},
	}
});

/* Actions */
export const setFilter = (dataSet, dataKey, values) => ({type: dataSet + '/setFilter', payload: {dataKey, values}});
export const addFilter = (dataSet, dataKey, value, filterType) => ({type: dataSet + '/addFilter', payload: {dataKey, value, filterType}});
export const removeFilter = (dataSet, dataKey, value, filterType) => ({type: dataSet + '/removeFilter', payload: {dataKey, value, filterType}});
export const clearFilter = (dataSet, dataKey) => ({type: dataSet + '/clearFilter', payload: {dataKey}});
export const clearAllFilters = (dataSet) => ({type: dataSet + '/clearAllFilters'});

/* Selectors */
 export const selectFilters = (state, dataSet) => state[dataSet][name];
 export const selectFilter = (state, dataSet, dataKey) => state[dataSet][name][dataKey];
 