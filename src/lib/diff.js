
/*
 * Compare two objects.
 * Return an object that has property values that are the individual property values if the two values are the same
 * and has the string '<multiple>' if the property values are different.
 */
export const MULTIPLE = '<multiple>';

export const isMultiple = (item) => item === MULTIPLE;

const isObject = o => o && typeof o === 'object';
const isDate = d => d instanceof Date;
const isEmpty = o => Object.keys(o).length === 0;

export function recursivelyDiffObjects(l, r) {
	const isObject = o => o != null && typeof o === 'object';

	if (l === r) return l;

	if (!isObject(l) || !isObject(r))
		return MULTIPLE;

	if (isDate(l) || isDate(r)) {
		if (l.valueOf() === r.valueOf()) return l;
		return MULTIPLE;
	}

	if (Array.isArray(l) && Array.isArray(r)) {
		if (l.length === r.length) {
			return l.map((v, i) => recursivelyDiffObjects(l[i], r[i]))
		}
	}
	else {
		const deletedValues = Object.keys(l).reduce((acc, key) => {
			return r.hasOwnProperty(key) ? acc : { ...acc, [key]: MULTIPLE };
		}, {});

		return Object.keys(r).reduce((acc, key) => {
			if (!l.hasOwnProperty(key)) return { ...acc, [key]: r[key] }; // return added r key

			const difference = recursivelyDiffObjects(l[key], r[key]);

			if (isObject(difference) && isEmpty(difference) && !isDate(difference)) return acc // return no diff

			return { ...acc, [key]: difference } // return updated key
		}, deletedValues)
	}
}


/*
 * Compare two objects and return an object that only has properties that differ
 *
 * @param original - object with original content
 * @param modified - object with modified content
 * @returns changes - object with content from modified that differs from original
 */
export function shallowDiff(original, modified) {
	const changes = {};
	for (let key in modified)
		if (modified[key] !== original[key])
			changes[key] = modified[key];
	return changes;
}

export function deepDiff(original, modified) {
	if (original === modified)
		return undefined;
	if (!isObject(original) || !isObject(modified))
		return modified;
	if (isDate(original) && isDate(modified))
		return original.valueOf() === modified.valueOf()? undefined: modified;
	if (Array.isArray(original) && Array.isArray(modified)) {
		const result = modified.map((v, i) => deepDiff(original[i], modified[i]));
		return result.find(v => v !== undefined)? result: undefined;
	}
	const changes = {};
	for (const key in modified) {
		const change = deepDiff(original[key], modified[key]);
		if (change !== undefined && (!isObject(change) || Array.isArray(change) || isDate(change) || !isEmpty(change)))
			changes[key] = change;
	}
	return changes;
}

/**
 * Performs a deep merge of objects and returns new object.
 *
 * @param obj1 - first object
 * @param obj2 - second object
 * @returns result - object with properties from both objects, recursively merged
 */
export function deepMerge(obj1, obj2) {
	if (obj1 === obj2)
		return obj2;
	if (!isObject(obj1) || !isObject(obj2))
		return obj2;
	if (isDate(obj1) && isDate(obj2))
		return obj2;
	if (Array.isArray(obj1) && Array.isArray(obj1)) {
		if (obj1.length !== obj2.length)
			return obj2;
		return obj1.map((v, i) => deepMerge(obj1[i], obj2[i]));
	}
	let result = {};
	// collect values present in obj1 but not obj2
	result = Object.keys(obj1).reduce((result, key) => (key in obj2)? result: {...result, [key]: obj1[key]}, result);
	// merge values in obj2
	result = Object.keys(obj2).reduce((result, key) => ({...result, [key]: (key in obj1)? deepMerge(obj1[key], obj2[key]): obj2[key]}), result);
	return result;
}

/**
 * Merge two objects and identify properties that have differences.
 * 
 * @param fist object
 * @param second object
 * @returns object that has values for properties with no differences and '<multiple>' for properties with differences
 */
export function deepMergeTagMultiple(obj1, obj2) {
	if (obj1 === obj2)
		return obj1;
	if (!isObject(obj1) || !isObject(obj2))
		return MULTIPLE;
	if (isDate(obj1) && isDate(obj2))
		return obj1.valueOf() === obj2.valueOf()? obj1: MULTIPLE;
	if (Array.isArray(obj1) && Array.isArray(obj1)) {
		if (obj1.length !== obj2.length)
			return MULTIPLE;
		const result = obj1.map((v, i) => deepMergeTagMultiple(obj1[i], obj2[i]));
		return result.includes(MULTIPLE)? MULTIPLE: result;
	}
	let result = {};
	// collect values present in obj1 but not obj2
	result = Object.keys(obj1).reduce((result, key) => (key in obj2)? result: {...result, [key]: obj1[key]}, result);
	// merge values in obj2
	result = Object.keys(obj2).reduce((result, key) => ({...result, [key]: (key in obj1)? deepMergeTagMultiple(obj1[key], obj2[key]): obj2[key]}), result);
	return result;
}
