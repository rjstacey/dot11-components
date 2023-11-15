import React from "react";

export type InputProps = {
	inputRef: any;
	props: object;
	state: object;
	methods: object;
};

function Input({ inputRef, props, state, methods }) {
	return (
		<input
			ref={inputRef}
			tabIndex={-1}
			className="dropdown-select-input"
			style={{ width: `${state.search.length + 1}ch` }}
			value={state.search}
			onChange={(event) => methods.setSearch(event.target.value)}
			disabled={props.disabled}
		/>
	);
}

export default Input;
