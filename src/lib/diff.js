
/*
 * Compare two objects.
 * Return an object that has property values that where the individual properties are the same
 * and has the string '<multiple>' where the property values are different.
 */
export const MULTIPLE = '<multiple>';
export const isMultiple = (value) => value === MULTIPLE;

export function recursivelyDiffObjects(l, r) {
	const isObject = o => o != null && typeof o === 'object';
	const isDate = d => d instanceof Date;
	const isEmpty = o => Object.keys(o).length === 0;

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
 * Compare two objects and return an object that has property values for
 * properties that are different.
 */
export function shallowDiff(originalObj, modifiedObj) {
	let changed = {};
	for (let k in modifiedObj)
		if (modifiedObj[k] !== originalObj[k])
			changed[k] = modifiedObj[k];
	return changed;
}
