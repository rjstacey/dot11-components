import type {Action, PayloadAction, EntityId} from '@reduxjs/toolkit';

const name = 'expanded';

const initialState = {
	[name]: []
};

export const createExpandedSubslice = (dataSet: string) => ({
	name: 'selected',
	initialState: {[name]: []},
	reducers: {
		setExpanded(state, action: PayloadAction<Array<EntityId>>) {state[name] = action.payload},
		toggleExpanded(state, action: PayloadAction<Array<EntityId>>) {
			const list = state[name];
			for (let id of action.payload) {
				const i = list.indexOf(id);
				if (i >= 0)
					list.splice(i, 1);
				else
					list.push(id);
			}
		}
	},
	extraReducers: (builder) => {
		builder
		.addMatcher(
			(action: Action) => action && action.type && action.type.startsWith(dataSet) && action.type.match(/(removeOne|removeMany|getSuccess)$/),
			(state) => {
				const list = state[name];
				const ids = state.ids;
				const newList = list.filter((id: EntityId) => ids.includes(id));
				state[name] = newList.length === list.length? list: newList;
			}
		);
	}
});

/* Actions */
export const setExpanded = (dataSet: string, ids) => ({type: dataSet + '/setExpanded', payload: ids});
export const toggleExpanded = (dataSet: string, ids) => ({type: dataSet + '/toggleExpanded', payload: ids});

/* Selectors */
export const selectExpanded = (state, dataSet: string) => state[dataSet][name];
 