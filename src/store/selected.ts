import type { EntityId, PayloadAction, Action } from '@reduxjs/toolkit';

const name = 'selected';

export type SelectedState = { [name]: EntityId[] };

const initialState: SelectedState = {
	[name]: []
};

export function createSelectedSubslice(dataSet: string) {
	return {
		name,
		initialState,
		reducers: {
			setSelected(state: SelectedState, action: PayloadAction<Array<EntityId>>) {state[name] = action.payload},
			toggleSelected(state: SelectedState, action: PayloadAction<Array<EntityId>>) {
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
				(state: {ids: EntityId[]} & SelectedState) => {
					const list = state[name];
					const ids = state.ids;
					const newList = list.filter(id => ids.includes(id));
					state[name] = newList.length === list.length? list: newList;
				}
			);
		}
	}
}

/* Actions */
export const setSelected = (dataSet: string, ids: Array<EntityId>) => ({type: dataSet + '/setSelected', payload: ids});
export const toggleSelected = (dataSet: string, ids: Array<EntityId>) => ({type: dataSet + '/toggleSelected', payload: ids});

/* Selectors */
export const selectSelected = (state, dataSet: string): Array<EntityId> => state[dataSet][name];
