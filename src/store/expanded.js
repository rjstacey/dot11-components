const name = 'expanded';

export const createExpandedSubslice = (dataSet) => ({
	name: 'selected',
	initialState: {[name]: []},
	reducers: {
		setExpanded(state, action) {state[name] = action.payload},
		toggleExpanded(state, action) {
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
			(action) => action && action.type && action.type.startsWith(dataSet) && action.type.match(/(removeOne|removeMany|getSuccess)$/),
			(state, action) => {
				const list = state[name];
				const ids = state.ids;
				const newList = list.filter(id => ids.includes(id));
				state[name] = newList.length === list.length? list: newList;
			}
		);
	}
});

/* Actions */
export const setExpanded = (dataSet, ids) => ({type: dataSet + '/setExpanded', payload: ids});
export const toggleExpanded = (dataSet, ids) => ({type: dataSet + '/toggleExpanded', payload: ids});

/* Selectors */
export const selectExpanded = (state, dataSet) => state[dataSet][name];
 