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

export const globalFilterKey = '__global__';

const parseNumber = (value) => {
	// Return the value as-is if it's already a number
	if (typeof value === 'number')
		return value;

	// Build regex to strip out everything except digits, decimal point and minus sign
	let regex = new RegExp('[^0-9-.]', ['g']);
	let unformatted = parseFloat((''+value).replace(regex, ''));

	// This will fail silently
	return !isNaN(unformatted)? unformatted: 0;
};


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

function cmpValue(comp, d) {
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
export function filterData(filters, getField, entities, ids) {
	let filteredIds = ids.slice();
	const dataKeys = Object.keys(filters).filter(dataKey => dataKey !== '__global__');
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

const filterCreate = ({options}) => ({
	options,	// Array of {label, value} objects
	comps: [],	// Array of compare objects where a compare object {value, FilterType}
})

function filtersInit(fields) {
	const filters = {};
	for (const [dataKey, field] of Object.entries(fields)) {
		if (!field.dontFilter)
			filters[dataKey] = filterCreate(field)
	}
	filters[globalFilterKey] = filterCreate({});
	return filters;
}

const name = 'filters';

export const createFiltersSubslice = (dataSet, fields) => ({
	name,
	initialState: {[name]: filtersInit(fields)},
	reducers: {
		setFilter(state, action) {
			const filters = state[name];
			const {dataKey, comps} = action.payload;
			const filter = filterCreate(filters[dataKey] || {});
			filter.comps = comps;
			filters[dataKey] = filter;
		},
		addFilter(state, action) {
			const filters = state[name];
			const {dataKey, value, filterType} = action.payload;
			filters[dataKey].comps.push({value, filterType});
		},
		removeFilter(state, action) {
			const filters = state[name];
			const {dataKey, value, filterType} = action.payload;
			filters[dataKey].comps = filters[dataKey].comps.filter(comp => comp.value !== value || comp.filterType !== filterType)
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
export const setFilter = (dataSet, dataKey, comps) => ({type: dataSet + '/setFilter', payload: {dataKey, comps}});
export const addFilter = (dataSet, dataKey, value, filterType) => ({type: dataSet + '/addFilter', payload: {dataKey, value, filterType}});
export const removeFilter = (dataSet, dataKey, value, filterType) => ({type: dataSet + '/removeFilter', payload: {dataKey, value, filterType}});
export const clearFilter = (dataSet, dataKey) => ({type: dataSet + '/clearFilter', payload: {dataKey}});
export const clearAllFilters = (dataSet) => ({type: dataSet + '/clearAllFilters'});

/* Selectors */
 export const selectFilters = (state, dataSet) => state[dataSet][name];
 export const selectFilter = (state, dataSet, dataKey) => state[dataSet][name][dataKey];
 