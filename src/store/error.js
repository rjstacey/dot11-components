import {createSlice} from '@reduxjs/toolkit'

const slice = createSlice({
	name: 'errMsg',
	initialState: [],
	reducers: {
		setError: {
			reducer: (state, action) => {
				const {summary, error} = action.payload;
				console.warn(summary, error)
				const detail = 
					(typeof error === 'string')
						? error
						: error.hasOwnProperty('detail')
							? error.detail
							: error.toString();
				state.push({summary, detail})
			},
			prepare: (summary, error) => ({payload: {summary, error}})
		},
		clearError(state, action) {
			if (state.length)
				state.shift();
		}
	}
});

export const {setError, clearError} = slice.actions;

export default slice.reducer;
