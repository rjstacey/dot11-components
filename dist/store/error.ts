import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkError } from '../lib/fetcher';

export type ErrorMsg = {
	summary: string;
	detail: string;
};

const initialState: Array<ErrorMsg> = [];

export type ErrorMsgState = typeof initialState;

const slice = createSlice({
	name: 'errMsg',
	initialState,
	reducers: {
		setError(state, action: PayloadAction<ErrorMsg>) {
			state.push(action.payload);
		},
		clearError(state) {
			if (state.length)
				state.shift();
		}
	}
});

export const {clearError} = slice.actions;

export function setError(summary: string, error: any) {
	let detail: string;
	if (error instanceof NetworkError) {
		const {response} = error;
		if (typeof response === 'object' && 'message' in response)
			detail = response.message as string;
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
