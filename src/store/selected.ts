import type { EntityId, PayloadAction, Action, SliceCaseReducers, ActionReducerMapBuilder } from '@reduxjs/toolkit';

const name = 'selected';

export type SelectedState = { [name]: EntityId[] };

export function createSelectedSubslice(dataSet: string) {

	const initialState: SelectedState = {[name]: []};

	const reducers: SliceCaseReducers<SelectedState> = {
		setSelected(state, action: PayloadAction<Array<EntityId>>) {state[name] = action.payload},
		toggleSelected(state, action: PayloadAction<Array<EntityId>>) {
			const list = state[name];
			for (let id of action.payload) {
				const i = list.indexOf(id);
				if (i >= 0)
					list.splice(i, 1);
				else
					list.push(id);
			}
		}
	};

	const extraReducers = (builder: ActionReducerMapBuilder<{ids: EntityId[]} & SelectedState>) => {
		builder
		.addMatcher(
			(action: Action) => action && action.type && action.type.startsWith(dataSet) && action.type.match(/(removeOne|removeMany|getSuccess)$/),
			(state) => {
				const list = state[name];
				const ids = state.ids;
				const newList = list.filter(id => ids.includes(id));
				state[name] = newList.length === list.length? list: newList;
			}
		);
	};

	return {
		name,
		initialState,
		reducers,
		extraReducers
	}
}

/* Actions */
export const setSelected = (dataSet: string, ids: EntityId[]) => ({type: dataSet + '/setSelected', payload: ids});
export const toggleSelected = (dataSet: string, ids: EntityId[]) => ({type: dataSet + '/toggleSelected', payload: ids});

/* Selectors */
export const selectSelected = (state: {}, dataSet: string): EntityId[] => state[dataSet][name];
