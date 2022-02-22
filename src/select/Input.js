import PropTypes from 'prop-types';
import React from 'react';

const Input = ({inputRef, value, onChange}) => 
	<input
		ref={inputRef}
		tabIndex="-1"
		className='select-input'
		style={{width: `${value.length + 1}ch`}}
		value={value}
		onChange={(event) => onChange(event.target.value)}
	/>

Input.propTypes = {
	inputRef: PropTypes.object.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default Input;
