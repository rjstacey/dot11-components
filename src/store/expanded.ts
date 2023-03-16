import type { EntityId, PayloadAction, Action, SliceCaseReducers, ActionReducerMapBuilder } from '@reduxjs/toolkit';

const name = 'expanded';

export type ExpandedState = { [name]: EntityId[] };

export function createExpandedSubslice(dataSet: string) {

	const initialState: ExpandedState = {[name]: []};

	const reducers: SliceCaseReducers<ExpandedState> = {
		setExpanded(state, action: PayloadAction<EntityId[]>) {state[name] = action.payload},
		toggleExpanded(state, action: PayloadAction<EntityId[]>) {
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

	const extraReducers = (builder: ActionReducerMapBuilder<ExpandedState & {ids: EntityId[]}>) => {
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
export const setExpanded = (dataSet: string, ids: Array<EntityId>) => ({type: dataSet + '/setExpanded', payload: ids});
export const toggleExpanded = (dataSet: string, ids: Array<EntityId>) => ({type: dataSet + '/toggleExpanded', payload: ids});

/* Selectors */
export const selectExpanded = (state, dataSet: string): Array<EntityId> => state[dataSet][name];
 