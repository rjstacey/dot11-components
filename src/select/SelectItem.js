import React from 'react';

const SelectItem = ({ item, props, state, methods }) =>
	<span
		className='select-item'
	>
		{item[props.labelField]}
	</span>

export default SelectItem;
