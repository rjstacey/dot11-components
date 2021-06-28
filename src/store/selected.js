import {createSlice} from '@reduxjs/toolkit'

const slice = createSlice({
	name: 'selected',
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
})

/* Export slice as default */
export default slice;

/* Actions */
export const setSelected = (dataSet, ids) => ({type: dataSet + '/' + slice.name + '/set', ids})
export const toggleSelected = (dataSet, ids) => ({type: dataSet + '/' + slice.name + '/toggle', ids})

/* Selectors */
export const getSelected = (state, dataSet) => state[dataSet][slice.name]
