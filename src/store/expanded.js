import {createSlice} from '@reduxjs/toolkit'

const slice = createSlice({
	name: 'expanded',
	initialState: [],
	reducers: {
		set(state, action) {return action.ids},
		toggle(state, action) {
			for (let id of action.ids) {
				const i = state.indexOf(id)
				if (i >= 0)
					state.splice(i, 1);
				else
					state.push(id);
			}
		}
	}
});

/* Export slice as default */
export default slice;

/* Actions */
export const setExpanded = (dataSet, ids) => ({type: dataSet + '/' + slice.name + '/set', ids})
export const toggleExpanded = (dataSet, ids) => ({type: dataSet + '/' + slice.name + '/toggle', ids})

/* Selectors */
export const getExpanded = (state, dataSet) => state[dataSet][slice.name]
 