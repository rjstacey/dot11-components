import {createSlice} from '@reduxjs/toolkit';
import {NetworkError} from '../lib/fetcher';

const slice = createSlice({
	name: 'errMsg',
	initialState: [],
	reducers: {
		setError(state, action) {
			state.push(action.payload)
		},
		clearError(state, action) {
			if (state.length)
				state.shift();
		}
	}
});

export const {clearError} = slice.actions;

export function setError(summary, error) {
	let detail;
	if (error instanceof NetworkError) {
		const {response} = error;
		if (typeof response === 'object' && response.hasOwnProperty('message'))
			detail = response.message;
		else if (typeof response === 'string')
			detail = response;
		else
			detail = JSON.stringify(response);
	}
	else if (typeof error === 'string') {
		detail = error;
	}
	else {
		detail = error.toString();
	}
	return slice.actions.setError({summary, detail});
}

export default slice.reducer;
