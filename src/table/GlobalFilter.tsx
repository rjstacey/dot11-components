import PropTypes from 'prop-types';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Input} from '../form';

import {selectFilter, setFilter, FilterType, globalFilterKey} from '../store/appTableData';

interface GlobalFilterProps extends React.ComponentProps<typeof Input> {
	dataSet: string;
}

function GlobalFilter({
	dataSet,
	...otherProps
}: GlobalFilterProps) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const dispatch = useDispatch();
	const selectGlobalFilter = React.useCallback(state => selectFilter(state, dataSet, globalFilterKey), [dataSet]);
	const globalFilter = useSelector(selectGlobalFilter);
	const value = (globalFilter && globalFilter.comps.length > 0)? globalFilter.comps[0].value: '';

	React.useEffect(() => {
		if (value === '//' && inputRef.current)
			inputRef.current.setSelectionRange(1, 1);
	}, [value]);

	const setGlobalFilter = (newValue: string) => {
		if (!value && newValue === '/') {
			// If search is empty and / is pressed, then add // to search
			// and position the cursor between the slashes (using the useEffect above)
			newValue = '//';
		}
		const comp = {value: newValue, filterType: FilterType.CONTAINS};
		if (newValue[0] === '/') {
			const parts = newValue.split('/');
			if (parts.length > 2) {
				// User is entering a regex in the form /pattern/flags.
				// If the regex doesn't validate then ignore it
				try {
					new RegExp(parts[1], parts[2]);
					comp.filterType = FilterType.REGEX;
				}
				catch (err) {}
			}
		}
		dispatch(setFilter(dataSet, globalFilterKey, [comp]));
	};

	return (
		<Input
			type='search'
			value={value}
			ref={inputRef}
			onChange={e => setGlobalFilter(e.target.value)}
			placeholder="Search..."
			{...otherProps}
		/>
	)
}

GlobalFilter.propTypes = {
	dataSet: PropTypes.string.isRequired
}

export default GlobalFilter;
