import React from 'react';

const SelectItem = ({item, props, state, methods}) =>
	<span
		className='dropdown-select-single-item'
	>
		{item[props.labelField]}
	</span>

export default SelectItem;
