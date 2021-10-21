const name = 'selected';

export const createSelectedSubslice = (dataSet) => ({
	name: 'selected',
	initialState: {[name]: []},
	reducers: {
		setSelected(state, action) {state[name] = action.payload},
		toggleSelected(state, action) {
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
export const setSelected = (dataSet, ids) => ({type: dataSet + '/setSelected', payload: ids})
export const toggleSelected = (dataSet, ids) => ({type: dataSet + '/toggleSelected', payload: ids})

/* Selectors */
export const getSelected = (state, dataSet) => state[dataSet][name]
