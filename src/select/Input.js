import PropTypes from 'prop-types';
import React from 'react';

function Input({inputRef, props, state, methods}) {

	return (
		<input
			ref={inputRef}
			tabIndex="-1"
			className='dropdown-select-input'
			style={{width: `${state.search.length + 1}ch`}}
			value={state.search}
			onChange={(event) => methods.setSearch(event.target.value)}
		/>
	)
}

Input.propTypes = {
	inputRef: PropTypes.object.isRequired,
	props: PropTypes.object.isRequired,
	state: PropTypes.object.isRequired,
	methods: PropTypes.object.isRequired,
};

export default Input;
