import {createSlice} from '@reduxjs/toolkit'

import sortsSlice, {initSorts} from './sort'
import filtersSlice, {initFilters} from './filters'
import selectedSlice from './selected'
import expandedSlice from './expanded'
import uiSlice from './ui'

export const appTableCreateSlice = ({
	name,
	fields,
	initialState,
	reducers
}) => {
	const state = {
		[sortsSlice.name]: sortsSlice.reducer(undefined, initSorts(fields)),
		[filtersSlice.name]: filtersSlice.reducer(undefined, initFilters(fields)),
		[selectedSlice.name]: selectedSlice.reducer(undefined, {}),
		[expandedSlice.name]: expandedSlice.reducer(undefined, {}),
		[uiSlice.name]: uiSlice.reducer(undefined, {})	
	};

	const slice = createSlice({
		name,
		initialState: {
			...initialState, 
			...state
		},
		reducers,
		extraReducers: builder => {
			builder
			.addMatcher(
				(action) => action.type.startsWith(name + '/'),
				(state, action) => {
					const sliceAction = {...action, type: action.type.replace(name + '/', '')}
					state[sortsSlice.name] = sortsSlice.reducer(state[sortsSlice.name], sliceAction);
					state[filtersSlice.name] = filtersSlice.reducer(state[filtersSlice.name], sliceAction);
					state[selectedSlice.name] = selectedSlice.reducer(state[selectedSlice.name], sliceAction);
					state[expandedSlice.name] = expandedSlice.reducer(state[expandedSlice.name], sliceAction);
					state[uiSlice.name] = uiSlice.reducer(state[uiSlice.name], sliceAction);
				}
			)
		}
	});
	return slice;
}