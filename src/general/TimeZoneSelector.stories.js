import React from 'react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import timeZonesReducer, {dataSet} from '../store/timeZones';
import TimeZoneSelector from './TimeZoneSelector';

const store = configureStore({
  reducer: combineReducers({
  	[dataSet]: timeZonesReducer
  }),
  middleware: [thunk, createLogger({collapsed: true})],
  devTools: true
});

const story = {
	title: 'Time zone selector',
	component: TimeZoneSelector,
	args: {
		expandable: false,
		numberOfRows: 5,
	},
	decorators: [
		(Story) =>
			<Provider store={store}>
				<Story />
			</Provider>
	]
};

export function TimeZoneSelectorTest() {
	return <TimeZoneSelector />
}

export default story;
