import { configureStore, combineReducers, createSelector, ThunkAction, EntityState, Action, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { useDispatch } from 'react-redux';

import { displayDate } from '../lib';

import { createAppTableDataSlice, SortType, AppTableDataState } from '../store/appTableData';

import { LoremIpsum } from "lorem-ipsum";


/*
 * Store setup
 */

type NameEntity = {
	id: number;
	Name: string;
}

/* Names slice maps an id to a name */
export const nameFields = {
	id: {label: 'id'},
	Name: {label: 'Name'},
};

const namesSlice = createAppTableDataSlice({
	name: 'names',
	fields: nameFields,
	initialState: {}
});

type NamesState = AppTableDataState<NameEntity>;

const statusOptions = [
	{value: 0, label: 'Good'},
	{value: 1, label: 'Bad'},
	{value: 2, label: 'Ugly'}
];

const renderStatus = (v: number) => {
	const o = statusOptions.find(o => o.value === v);
	return o? o.label: v;
}

type DataEntity = {
	id: number;
	name_id: number;
	Date: string;
	Number: number;
	Text: string;
	Status: number;
}

export const dataFields = {
	id: {label: 'ID', isId: true, sortType: SortType.NUMERIC},
	Name: {label: 'Name'},
	Date: {
		label: 'Date',
		dataRenderer: displayDate,
		sortType: SortType.DATE
	},
	Text: {
		label: 'Text',
	},
	Number: {
		label: 'Number',
		sortType: SortType.NUMERIC
	},
	Status: {
		label: 'Status',
		dataRenderer: renderStatus,
		options: statusOptions,
		sortType: SortType.NUMERIC,
		dontSort: true,
		dontFilter: true
	},
	Derived: {
		label: 'Derived'
	},
};

const selectField = (data: DataEntity, dataKey: string) => {
	if (dataKey === 'Derived')
		return data.Status + '-es';
	return data[dataKey];
}

const selectNamesEntities = (state: any) => (state['names'] as NamesState).entities;

const selectDataEntities = (state: any) => (state['data'] as DataState).entities;

/* A selector that returns the entities with name_id mapped to Name */
const selectEntities = createSelector(
	[selectNamesEntities,
	selectDataEntities],
	(namesEntities, dataEntities) => {
		const entities: { [id: string]: DataEntity & { Name: string }} = {};
		for (const [id, entity] of Object.entries(dataEntities)) {
			if (!entity)
				continue;
			const nameEntity = namesEntities[entity.name_id];
			const Name = nameEntity? nameEntity.Name: '';
			entities[id] = {...entity, Name};
		}
		return entities;
	}
);

const initialState = {extra: false};

type DataState = AppTableDataState<DataEntity> & typeof initialState;

const reducers: SliceCaseReducers<DataState> = {
	setExtra(state, action: PayloadAction<boolean>) {
		state.extra = action.payload;
	}
}

const dataSlice = createAppTableDataSlice<DataEntity, DataState>({
	name: 'data',
	fields: dataFields,
	initialState,
	reducers,
	selectField,
	selectEntities
});


const rootReducer = combineReducers({
	[namesSlice.name]: namesSlice.reducer,
	[dataSlice.name]: dataSlice.reducer,
});

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(createLogger({collapsed: true})),
	devTools: true
});

type RootState = ReturnType<typeof rootReducer>;
type AppDispatch = typeof store.dispatch;
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;

export const useAppDispatch: () => AppDispatch = useDispatch;
//const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

const randomDate = (start: Date, end: Date) =>
	new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const randomStatus = () => Math.round(Math.random() * (statusOptions.length - 1));

const lorem = new LoremIpsum({
	sentencesPerParagraph: {max: 8, min: 4},
	wordsPerSentence: {max: 16, min: 4}
});

const MaxNames = 4;


const genData = (n: number): Array<DataEntity> =>
	new Array(n)
		.fill(true)
		.map((r, i) => ({
			id: i,
			name_id: Math.floor(Math.random() * MaxNames),
			Date: randomDate(new Date(2010, 0, 1), new Date()).toISOString(),
			Number: Math.round(Math.random() * 5),
			Text: lorem.generateSentences(3),
			Status: randomStatus()
		}));

const genNames = (): Array<NameEntity> =>
	new Array(MaxNames)
		.fill(true)
		.map((r, i) => ({
			id: i,
			Name: Math.random().toString(36).slice(2),
		}));

export const loadData = (n = 1000): AppThunk =>
	(dispatch) => {
		const names = genNames();
		dispatch(namesSlice.actions.getSuccess(names));

		const {getPending, getSuccess} = dataSlice.actions;
		dispatch(getPending());
		const data = genData(n);
		setTimeout(() => dispatch(getSuccess(data)), 1000);
	}

export const removeRow = dataSlice.actions.removeOne;

export default store;
